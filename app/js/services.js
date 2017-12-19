sistemasOperacionais.factory('AlgorithmFactoryService', function (RoundRobinAlgorithmService, LeastTimeToGoAlgorithmService) {
    var algorithm = {};

    algorithm.buildAlgorithm = function(value) {
        var service;
        switch (value) {
            case '1':
                service = RoundRobinAlgorithmService;
                return service;

            case '2':
                service = LeastTimeToGoAlgorithmService;
                return service
        }

    };

    return algorithm;
});

sistemasOperacionais.factory('MemoryAlgorithmFactoryService', function (BestFitService,QuickFitService,MergeFitService) {
    var memoryAlgorithm = {};

    memoryAlgorithm.buildAlgorithm = function (value) {
        var service;

        switch (value){
            case '1':
                service = BestFitService;
                return service;
            case '2':
                 return QuickFitService;
            case '3':
                 return MergeFitService;
        }
    };



    return memoryAlgorithm;
})
    .service('MemoryHelper',function($filter){
        var memory;
        return {
            setMemory: function(mem){
                memory = mem
            },
            isAlocado: function(processo){
                return !memory.blocks.every(function(block){
                    return !(block.processo && block.processo.pid == processo.pid);
                })
            },
            indexOfBlock: function(id){
              for(var i = 0;i < memory.blocks.length; i++){
                if(memory.blocks[i].processo.pid == id){
                  return memory.blocks[i];
                }
              }
              return null;
            },
            isFull: function(size){
                return size > memory.size || memory.size < 1
            },
            random: function(min,max){
                return Math.floor(Math.random() * (max - min + 1)) + min;
            },
            encerrarProcesso: function(processo,algoritmo){
                memory.blocks.forEach(function(block){
                    if(!block.virtual && block.processo && block.processo.pid == processo.pid){
                        block.name = 'DISPONIVEL';
                        block.processo = null;
                        block.usado = 0;
                        if(algoritmo.memory.quickBlocks){
                            //Para sincronizar os blocos com os quickBlocks criados no quickFit.
                            for(var i =1 ; i <=5; i++){
                                var viewBlock = $filter('getById')(algoritmo.memory.quickBlocks[i].blocks, block.id);
                                if(viewBlock){
                                    viewBlock.processo = null;
                                    viewBlock.name = 'DISPONIVEL';
                                }
                            }
                        }
                    }
                });
                memory.size += processo.memory;
            }
        }
    })
.filter('getById', function() {
    return function(input, id) {
        var i=0, len=input.length;
        for (; i<len; i++) {
            if (+input[i].id == +id) {
                return input[i];
            }
        }
        return null;
    }
});
