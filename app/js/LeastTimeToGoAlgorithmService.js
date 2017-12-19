sistemasOperacionais.factory('LeastTimeToGoAlgorithmService', function ($interval) {
    var ltg = {};

    ltg.coresLiberados = [];

    ltg.configurar = function(config){
       
        ltg.filaDePrioridade = [];
     
        ltg.config = config;
  
        ltg.coresLiberados = angular.copy(config.cores);
    }


    ltg.createProcess = function(scopeProccesses){
        var pid = scopeProccesses.length;
        var proc = {
            pid: pid,
            processo: "Processo " + pid,
            progress: 0,
            state: 'Pronto',
            tempoExecutado: 0,
            tempoTotal: getRandomNum(4,20),
            deadLine : getRandomNum(4,20)
        }
        var deadLine = proc.deadLine;
        proc.deadLineOriginal = deadLine;

    
        ltg.filaDePrioridade.push(proc);
        insertionSort(ltg.filaDePrioridade)

        scopeProccesses.push(proc);
    }


    ltg.executar = function(){
        var func = $interval(function () {
   
            if (!ltg.config.running) {
                $interval.cancel(func);
                return;
            }
            execLTG(ltg.config)
        }, -1);
    }

    var execLTG = function(config){

        var processo = buscarProximoProcesso();

        if (processo) {
            var currentProcessor = ltg.coresLiberados.shift();

            if (currentProcessor) {
                var core = config.cores[currentProcessor.id];

                core.state = 'Executando';
                core.processo = processo;
                core.tempo = processo.tempoTotal;
                core.interval = false;

                if (core.interval == false) {
                    core.interval = $interval(function () {

                     
                        ltg.filaDePrioridade.forEach(function (eachProcesso) {
                            if(eachProcesso.state != 'Executando' && eachProcesso.deadLine == 0){
                                eachProcesso.state = 'Abortado';
                                eachProcesso.progressStyle = 'danger';
                                eachProcesso.progress = 100;
                            }else{
                                eachProcesso.deadLine -=1;
                            }
                        })
                      
                        if(core.tempo > 0 && processo.state != 'Abortado'){
                            var coreTempo = core.tempo - 1;
                            if(coreTempo < 0){
                                core.tempo = 0;
                            }else{
                                core.tempo --;
                            }
                            processo.state = 'Executando';
                            processo.progressStyle = 'default';
                            processo.tempoExecutado += 1;
                            processo.progress = Math.floor((processo.tempoExecutado / processo.tempoTotal) * 100);
                            
                        }else if(processo.tempoExecutado == processo.tempoTotal){
                            $interval.cancel(core.interval);
                            ltg.coresLiberados.splice(currentProcessor.id, 0, currentProcessor);
                            core.state = 'Parado';
                            core.processo = undefined;
                            core.interval = false;
                            core.tempo = 0;
                            processo.progress = 100;
                            processo.state = 'Concluido';
                            processo.progressStyle = 'success';
                        }
                    }, 1000);
                }
            }else if(processo.state != 'Executando'){
                ltg.filaDePrioridade.push(processo);
                insertionSort(ltg.filaDePrioridade)
            }
        }


    }

    var buscarProximoProcesso = function () {

        var processo = ltg.filaDePrioridade.shift();
        if(processo && processo.state == 'Abortado'){
            processo = buscarProximoProcesso();
        }

        return processo;
    }

    function getRandomNum(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }



    function insertionSort(processos) {
        var len = processos.length;
        for (var i = 0; i < len ; i++) {
            var tmp = processos[i].deadLine; 
            var processostmp = processos[i];
           
            for (var j = i - 1; j >= 0 && (processos[j].deadLine > tmp); j--) {
         
                processos[j + 1] = processos[j];
            }
       
          
            processos[j + 1] = processostmp;
        }
    }

    return ltg;

});
