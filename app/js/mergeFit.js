sistemasOperacionais.factory('MergeFitService', function (MemoryHelper,$interval) {
    var mergeFit = {};
    var header;
    var blockCounter = 0;
    var alocado = false;

    mergeFit.adicionarNaMemoria = function (processo) {
        if(processo.state != 'Pronto' || processo.state == 'Abortado') return;

        if(this.memory.blocks.length == 0){
            mergeFit.memory.blocks.push({
                processo: null,
                data: [this.memory.size,0],
                size: this.memory.size,
                id: blockCounter++,
                name: 'DISPONIVEL',
            });
            mergeFit.config.arrayOfProcessMemory.series = this.memory.blocks;
        }
        var novoBloco = null;

        alocado = false;

        novoBloco = mergeFit.split(processo,processo.memory,this.memory.blocks[0],0);
        alocado = false;

      
        if(!novoBloco){
            processo.state = 'Abortado';
            return;
        }

       
    };

    var lastNode;
    mergeFit.split = function(processo,memory,current,index){
        return (function(processo,current,index){
            var self = this;

            if(!current){
                return null;
            }

            if(!current.processo && !current.isVirtual && current.size == memory){
                if(current.size < memory){
                    debugger;
                }
              
                current.processo = processo;
                current.name = 'Processo ' + processo.pid;
                current.usado = memory;
                lastBlockProcess[processo.pid] = current;
                alocado = true;
                mergeFit.memory.size -= memory;
                return current;
            }else if(!current.processo && !current.isVirtual && current.size > memory){
                mergeFit.memory.blocks.splice(index,1);
                var livre = {
                    id: blockCounter++,
                    processo: null,
                    name: 'DISPONIVEL',
                    size: current.size - memory,
                    data: [current.size - memory,0],
                    usado: 0,
                };
                var usado = {
                    id: blockCounter++,
                    processo: processo,
                    name: 'Processo ' + processo.pid,
                    size: memory,
                    data: [memory,0],
                    usado: memory,
                };

                if(!processo.blocks){
                    processo.blocks = [];
                }
                processo.blocks.push(usado.id);

            
                var previous = mergeFit.memory.blocks[index - 1];
                idx = index - 1;
                while(previous && previous.isVirtual){
                    previous = mergeFit.memory.blocks[idx];
                }

                if(previous){
                    previous.proximo = usado;
                }

             
                usado.proximo = livre;
                var next = mergeFit.memory.blocks[index];
                idx = index;
                while(next && next.isVirtual){
                    next = mergeFit.memory.blocks[++idx];
                }
                livre.proximo = next;
               
                mergeFit.memory.blocks.splice(index,0,livre);
                mergeFit.memory.blocks.splice(index,0,usado);
                alocado = true;
                lastBlockProcess[processo.pid] = usado;
                mergeFit.memory.size -= memory;
                return usado;
            }else if(!current.isVirtual){
                self.next = mergeFit.split(processo,memory,current.proximo,index + 1);
            }
            return self.next;
        })(processo,current,index);
    }

    var lastBlockProcess = [];
    mergeFit.aumentarMemoria = function(processo,memorySwapping){
        var newSize = MemoryHelper.random(2,32);
        if(newSize > mergeFit.memory.size){
            processo.state = 'Abortado';
        }
        var bloco = lastBlockProcess[processo.pid];
        if(processo.state != 'Abortado'){
            if((bloco.usado + newSize) > bloco.size){
                if((bloco.size - bloco.usado) > 0){
                    var remaining = newSize - bloco.size;
                    bloco.usado = bloco.size;
                    bloco = mergeFit.split(processo,newSize - bloco.size,this.memory.blocks[0],0);
                }else{
                    bloco = mergeFit.split(processo,newSize,this.memory.blocks[0],0);
                }
                if(!bloco) processo.state = 'Abortado';
            }

            if(!bloco || processo.state == 'Abortado'){
                debugger;
                return false;
            }
            processo.memory += newSize;
            alocado = false;
        }

        if(processo.state == 'Abortado'){
            mergeFit.encerrarProcesso(processo,mergeFit.memory.blocks[0],0);
        }

        return processo.state != 'Abortado';
    };

    mergeFit.merge = function(processo,block,index,isSwap){
        return (function(processo,block,index){
            if(!block || (block && block.isVirtual)) return;
            var next =  mergeFit.merge(processo,block.proximo,index + 1);


            if(block.processo && processo && block.processo.pid == processo.pid){
                block.processo = null;
                block.name = 'DISPONIVEL';
                mergeFit.memory.size += block.size;
                block.usado = 0;
                if(processo.blocks){
                    processo.blocks.splice(processo.blocks.indexOf(block.id),1);
                }
            }

            if(!block.processo && next && !next.processo && (!block.isVirtual && !next.isVirtual)){

                var mergeBlocks = mergeFit.memory.blocks.splice(index,2);
                var merged = {
                    id: blockCounter++,
                    name: 'DISPONIVEL',
                    processo: null,
                    size: mergeBlocks[0].size + mergeBlocks[1].size,
                    usado: 0,
                    data: [mergeBlocks[0].size + mergeBlocks[1].size,0],
                }
                var previous = mergeFit.memory.blocks[index - 1];
                indx = index - 1;
                while(previous && previous.isVirtual){
                    previous = mergeFit.memory.blocks[--indx]
                }
                if(previous){
                    previous.proximo = merged;
                }
                var proximo = mergeFit.memory.blocks[index];
                idx = index;
                while(proximo && proximo.isVirtual){
                    proximo = mergeFit.memory.blocks[++idx];
                }
                merged.proximo = proximo;
                mergeFit.memory.blocks.splice(index,0,merged);
            }
            return mergeFit.memory.blocks[index];
        })(processo,block,index);
    }

    mergeFit.encerrarProcesso = function(processo,isSwap){
        this.merge(processo,this.memory.blocks[0],0,isSwap);
    };

    return mergeFit;
});