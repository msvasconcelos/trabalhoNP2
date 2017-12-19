sistemasOperacionais.factory('QuickFitService', function (MemoryHelper, $filter) {
  var quickFit = {};
  quickFit.rec = 0;
  quickFit.ocorrencias = [];
  quickFit.sortedBlocks = [];
  var tamblock = 0;

  quickFit.desfazerAlocacoes = function(blocks){
    blocks.forEach(function(block){
      block.processo = null;
      block.name = 'DISPONIVEL';
      if(quickFit.memory.quickBlocks){
        for(var i =1 ; i <=5; i++){
          var viewBlock = $filter('getById')(quickFit.memory.quickBlocks[i].blocks, block.id);
          if(viewBlock){
            viewBlock.processo = null;
            viewBlock.name = 'DISPONIVEL';
          }
        }
      }
    });
  }

  quickFit.add = function(processo,newSize){
    var size = newSize || processo.memory;
    quickFit.rec++;

    if(!quickFit.ocorrencias[size]){

      quickFit.ocorrencias[size] = {
        ocorrencias : 0,
        size : size};
    }
    quickFit.ocorrencias[size].ocorrencias++;

    var quickFitBlock;
    if(quickFit.memory.quickBlocks){
      var blockNum = 0;
      quickFit.memory.quickBlocks.forEach(function (eachBlock) {
        if(eachBlock.size == size){
          eachBlock.blocks.every(function (block) {
            if(block.processo == undefined){
              var viewBlock = $filter('getById')(quickFit.memory.blocks, block.id);
              quickFitBlock = viewBlock;
              viewBlock.processo = processo;
              viewBlock.name = 'Processo ' + processo.pid;
              block.processo = processo;
              block.name = 'Processo ' + processo.pid;
              return false;
            }else{
              return true;
            }
          });
          if(!quickFitBlock){
            if(!((tamblock + size) > quickFit.memory.totalSize)){
              var newBlock = {
                id: quickFit.memory.blocks.length,
                processo: processo,
                size: size,
                data: [0,size],
                name: 'Processo ' + processo.pid
              };
              quickFitBlock = newBlock;
              tamblock += size;
              quickFit.memory.quickBlocks[blockNum+1].blocks.push(newBlock);
              quickFit.memory.blocks.push(newBlock);
              quickFit.config.arrayOfProcessMemory.series.push(newBlock);
              quickFit.sortedBlocks.push(newBlock);
            }
          }
        }
        blockNum++;
      });
      if(!quickFitBlock){
        quickFit.memory.quickBlocks[5].blocks.every(function (block) {
        
          if(block.size >= size && block.processo == undefined){
            var viewBlock = $filter('getById')(quickFit.memory.blocks, block.id);
            quickFitBlock = viewBlock;
            viewBlock.processo = processo;
            viewBlock.name = 'Processo ' + processo.pid;
            block.processo = processo;
            block.name = 'Processo ' + processo.pid;
            return false;
          }else{
            return true;
          }
        });
        if(!quickFitBlock){

          if(!((tamblock + size) > this.memory.totalSize)){

            var block = {
              id: this.memory.blocks.length,
              processo: processo,
              size: size,
              data: [0,size],
              name: 'Processo ' + processo.pid
            };
            tamblock += size;
            quickFit.memory.quickBlocks[5].blocks.push(block);
            this.memory.blocks.push(block);
            this.config.arrayOfProcessMemory.series.push(block);
            quickFit.sortedBlocks.push(block);
          }else{
            quickFit.memory.quickBlocks.forEach(function (eachBlock) {
              if(eachBlock.size >= size){
                eachBlock.blocks.every(function (block) {
                  if(block.processo == undefined){
                    var viewBlock = $filter('getById')(quickFit.memory.blocks, block.id);
                    quickFitBlock = viewBlock;
                    viewBlock.processo = processo;
                    viewBlock.name = 'Processo ' + processo.pid;
                    block.processo = processo;
                    block.name = 'Processo ' + processo.pid;
                    return false;
                  }else{
                    return true;
                  }
                })
              }
            });

            if(!quickFitBlock){
              processo.state = 'Abortado';
              return;
            }
          }
        }

      }

      this.memory.size -= (newSize || processo.memory);

    }else{

      var size = newSize || processo.memory;

      quickFit.sortedBlocks.sort(function(blockA,blockB){ return blockB.size - blockA.size; });
      var bestFitBlock;
      for(var i = 0;i < quickFit.sortedBlocks.length; i++){
        if(!quickFit.sortedBlocks[i].processo && quickFit.sortedBlocks[i].size >= size){
          bestFitBlock = quickFit.sortedBlocks[i];
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
          name: 'Processo ' + processo.pid
        };

        tamblock += size;
        this.memory.blocks.push(block);
        this.config.arrayOfProcessMemory.series.push(block);
        /** lista auxiliar de blocos ordenados pelo tamanho **/
        quickFit.sortedBlocks.push(block);
      }else{
 
        bestFitBlock.name = 'Processo ' + processo.pid;
        bestFitBlock.processo = processo;
      }

      this.memory.size -= (newSize || processo.memory);
    }
  }

  quickFit.adicionarNaMemoria = function (processo) {
    if(MemoryHelper.isAlocado(processo)) return;

    if(MemoryHelper.isFull(processo.memory)){
      console.log('Processo ',processo.pid,' foi abortado ');
      processo.state = 'Abortado';
      return;
    }
    if(quickFit.rec > 20){
      this.ajustarBlocos();
      quickFit.rec = 0;
    }

    this.add(processo);
  };

  quickFit.aumentarMemoria = function(processo){
    var newSize = MemoryHelper.random(2,128);
    if(MemoryHelper.isFull(newSize)){
      processo.state = 'Abortado';
    }else{

      this.add(processo,newSize);
    }

    if(processo.state != 'Abortado'){

      processo.memory += newSize;
    }else{
     
      this.desfazerAlocacoes(this.memory.blocks.filter(function(block){ return block.processo && block.processo.pid == processo.pid }));
      this.config.totalMemory = this.memory.size += processo.memory;
    }
 
    return processo.state != 'Abortado';
  };

  quickFit.ajustarBlocos = function(){

    quickFit.memory.quickBlocks = [];

    var ocorrencias = angular.copy(quickFit.ocorrencias);

    var topKeys =  ocorrencias.sort(function (ocorrenciaA, ocorrenciaB) {
      return ocorrenciaB.ocorrencias - ocorrenciaA.ocorrencias;
    });

    var orderedBlocks = angular.copy(quickFit.sortedBlocks.sort(function(blockA,blockB){
      return blockB.size - blockA.size;
    }));

    var count = 1;
    topKeys.forEach(function (eachKey) {

      for(var i = 0;i < orderedBlocks.length; i++){
        if(count <= 4){
          if(orderedBlocks[i].size == eachKey.size && !orderedBlocks[i].inserted){
            if(quickFit.memory.quickBlocks[count]){
              quickFit.memory.quickBlocks[count].blocks.push(orderedBlocks[i]);
              orderedBlocks[i].inserted = true;
            }else{
              quickFit.memory.quickBlocks[count] = {
                blocks: [orderedBlocks[i]],
                size : orderedBlocks[i].size

              };

              orderedBlocks[i].inserted = true;
            }

          }
        }else{

          if(!orderedBlocks[i].inserted){
            if(quickFit.memory.quickBlocks[5]){
              quickFit.memory.quickBlocks[5].blocks.push(orderedBlocks[i]);
              orderedBlocks[i].inserted = true;
            }else{
              quickFit.memory.quickBlocks[5] = {
                blocks: [orderedBlocks[i]],
                size : orderedBlocks[i].size
              };
              orderedBlocks[i].inserted = true;
            }
          }
        }
      }
      if(quickFit.memory.quickBlocks[count]){
        count++;
      }
    })

  }

  quickFit.encerrarProcesso = function(processo){
    MemoryHelper.encerrarProcesso(processo,this);
  };

  return quickFit;
});
