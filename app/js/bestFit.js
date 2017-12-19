sistemasOperacionais.factory('BestFitService', function (MemoryHelper) {
    var bestFit = {};
    var sortedBlocks = [];
    var tamblock = 0;
    var lastBlockProcess = [];

    
    bestFit.add = function(processo,newSize){
        
        var size = newSize || processo.memory;

      
        sortedBlocks.sort(function(blockA,blockB){ return blockB.size - blockA.size; });
        var bestFitBlock;
        for(var i = 0;i < sortedBlocks.length; i++){
            if(!sortedBlocks[i].processo && sortedBlocks[i].size >= size){
                bestFitBlock = sortedBlocks[i];
            }
        }

       
        if(!bestFitBlock){

           
            if((tamblock + size) > this.memory.totalSize){
                processo.state = 'Abortado';
                return;
            }
            var block = {
                id: this.memory.blocks.length,
                processo: processo,
                size: size,
                data: [size,0],
                name: 'Processo ' + processo.pid,
                usado: size,
            };
           
            tamblock += size;
            bestFit.memory.blocks.push(block);
            bestFitBlock = block;
            
            sortedBlocks.push(block);
        }else{
           
            bestFitBlock.name = 'Processo ' + processo.pid;
            bestFitBlock.processo = processo;
            bestFitBlock.usado = size < bestFitBlock.size ? size : bestFitBlock.size;
        }

       
        lastBlockProcess[processo.pid] = bestFitBlock;
        
        bestFit.memory.size -= size;
    }

    bestFit.adicionarNaMemoria = function (processo) {
        if(bestFit.config.arrayOfProcessMemory.series.length == 0){
            bestFit.config.arrayOfProcessMemory.series = bestFit.memory.blocks;
        }
        if(processo.state != 'Pronto' && !processo.isSwapped) return;

        if(processo.memory > bestFit.memory.size){
            processo.state = 'Abortado';
            return;
        }
        bestFit.add(processo);
    };

    bestFit.aumentarMemoria = function(processo){
        var newSize = MemoryHelper.random(2,32);

        if(newSize > bestFit.memory.size){
            processo.state = 'Abortado';
        }

        var bloco = lastBlockProcess[processo.pid];
        if(processo.state != 'Abortado'){
            if((bloco.usado + newSize) > bloco.size){
                if((bloco.size - bloco.usado) > 0){
                    var remaining = newSize - bloco.size;
                    bloco.usado = bloco.size;
                    bestFit.add(processo,newSize - bloco.usado);
                }else{
                    bestFit.add(processo,newSize);
                }
            }else{
                
                bloco.usado += newSize;
            }
        }

       
        if(processo.state == 'Abortado'){
            bestFit.encerrarProcesso(processo);
        }else{
            processo.memory += newSize;
            bestFit.memory.size -= newSize;
        }

        return processo.state != 'Abortado';
    };

    bestFit.encerrarProcesso = function(processo){
        MemoryHelper.encerrarProcesso(processo,this);
        var livre = true;
        for(var i = 0;i < bestFit.memory.blocks.length;i++){
            if(bestFit.memory.blocks[i].processo){
                livre = false;
                break;
            }
        }
       
        if(livre && bestFit.memory.size != this.memory.totalSize){
            bestFit.memory.size = this.memory.totalSize;
        }
    };

    return bestFit;
});