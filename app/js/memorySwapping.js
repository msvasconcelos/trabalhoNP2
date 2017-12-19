sistemasOperacionais.factory('MemorySwappingService', function (MemoryHelper) {
    var virtualMemory = {};
    virtualMemory.blocks = [];
    var sortedVirtualBlocks = [];
    var processToRemove = {};

    virtualMemory.needsSwap = function(memoryService,memory){
       
        return Math.floor(((memoryService.memory.totalSize - (memory ? (memoryService.memory.size - memory) : memoryService.memory.size)) / memoryService.memory.totalSize) * 100);
    }

    virtualMemory.swapBack = function(memoryService,processo){
        var success = true;
        var blocks = this.blocks.filter(function(block){
            return block.processo && block.processo.pid == processo.pid;
        });
        if(blocks.length == 0) {
            debugger;
            return;
        }
        blocks.every(function(block){
            if(memoryService.split){
                var threshold = Math.floor( (memoryService.memory.totalSize -  memoryService.memory.size) / memoryService.memory.totalSize * 100 );
                var needsSwap = Math.floor( (memoryService.memory.totalSize -  memoryService.memory.size - block.size) / memoryService.memory.totalSize * 100);
                if(threshold > 70){
                    virtualMemory.swap(memoryService);
                }
                if(success){
                    if(!processo){
                        debugger;
                    }
                    var blockInMemory = memoryService.split(processo,block.size,memoryService.memory.blocks[0],0);
                    if(!blockInMemory){
                        processo.state = 'Abortado';
                        success = false;
                    }else{
                        processo.blocks.push(blockInMemory.id);
                    }
                }
                block.name = 'DISPONIVEL';
                block.processo = null;
                block.usado = 0;
                processo.blocks.splice(processo.blocks.indexOf(block.id),1);
                return true;
            }
        });
        return success;
    }

    virtualMemory.hasSwapped = function(processo){
        for(var i = 0;processo.blocks && i < processo.blocks.length;i++){
            if(isNaN(processo.blocks[i])){
                return true;
            }
        }
        return false;
    }

    virtualMemory.swap = function (memoryService) {
        var stop = false;
        if((usage = virtualMemory.needsSwap(memoryService)) > 70){

           
            memoryService.config.filaDePrioridade.every(function(fila){
                fila.filter(function(processo){
                        return processo.state == 'Aguardando';
                    })
                    .reverse().every(function(processo){
                    var processBlocks = [],processBlocksIDs = [];
                    processo.blocks.forEach(function(id){
                        processBlocks = processBlocks.concat(memoryService.memory.blocks.filter(function(block){
                            return block.id == id;
                        }))
                    });

                 
                    for(var i = 0;i < processBlocks.length;i++){
                        if(processBlocks[i].isVirtual){
                            continue;
                        }
                        if((usage = virtualMemory.needsSwap(memoryService)) > 70){
                          
                            processo.blocks.splice(processo.blocks.indexOf(processBlocks[i].id),1);
                            var block = processBlocks[i];
                           
                            var newBlock = angular.copy(block);

                            block.processo = null;
                            block.name = 'DISPONIVEL';
                            block.usado = 0;

                            newBlock.id = btoa(newBlock.id);
                            newBlock.processo = processo;
                            newBlock.isVirtual = true;
                            newBlock.data = newBlock.data.reverse();
                            processBlocksIDs.push(newBlock.id);
                            delete newBlock.proximo;

                            memoryService.config.memory.size += block.size;
                          
                            memoryService.encerrarProcesso(null,true);
                           
                            virtualMemory.allocate(processo,newBlock,memoryService);
                        }else{
                            stop = true;
                            break;
                        }
                    }
                    if(processBlocksIDs.length > 0){
                       
                        processo.blocks = processo.blocks.concat(processBlocksIDs);
                    }
                    return !stop;
                });
               
                return (usage = virtualMemory.needsSwap(memoryService)) <= 70;
            });
        }else{
          
            if(virtualMemory.blocks.length == 0) return;
            memoryService.config.filaDePrioridade.every(function(fila){
                fila.filter(function(processo){
                        return processo.state == 'Abortado';
                    })
                    .every(function(processo){
                        var processBlocks = [];
                        processo.blocks.forEach(function(id){
                            processBlocks = processBlocks.concat(virtualMemory.blocks.filter(function(block){
                                return block.id == id;
                            }));
                        });

                        if(memoryService.split){
                            for(var i = 0;i < processBlocks.length; i++){
                                if((usage = virtualMemory.needsSwap()) <= 70){
                                    memoryService.split(processo,processBlocks[i].size,memoryService.memory.blocks[0],0);
                                    processBlocks[i].name = 'DISPONIVEL';
                                    processBlocks[i].usado = 0;
                                    processBlocks[i].processo = null;
                                }else{
                                    stop = true;
                                    break;
                                }
                            }
                        }
                        return !stop;
                    })
                return (usage = virtualMemory.needsSwap(memoryService)) <= 70;
            });
        }
    }

    virtualMemory.allocate = function(processo,block,memoryService){

        sortedVirtualBlocks.sort(function(blockA,blockB){ return blockB.size - blockA.size; });
        var bestFitBlock;
        for(var i = 0;i < sortedVirtualBlocks.length; i++){
            if(!sortedVirtualBlocks[i].processo && sortedVirtualBlocks[i].size >= processToRemove.size){
                bestFitBlock = sortedVirtualBlocks[i];
            }
        }
    
        if(!bestFitBlock){

            
            virtualMemory.blocks.push(block);
            bestFitBlock = block;
           
            sortedVirtualBlocks.push(block);
            memoryService.config.arrayOfProcessMemory.series.push(block);
        }else{
            
            bestFitBlock.name = 'Processo ' + processToRemove.pid;
            bestFitBlock.processo = processToRemove;
            bestFitBlock.usado = processToRemove.memory < bestFitBlock.size ? processToRemove.memory : bestFitBlock.size;
        }
    }

    return virtualMemory;
});