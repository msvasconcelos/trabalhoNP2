sistemasOperacionais.controller('indexController', function ($rootScope, $scope) {
    $scope.config = {
        coresNumber: 1,
        algoritmo: "1",
        memoryAlgoritmo : "1",
        totalMemory : 1024,
        memoryBlock: [],
        arrayOfProcessMemory: [],
        quantum: 1,
        processos: 1,
        processadores: [],
        running: false,
        memory: {
          blocks: [],
          size: 0,
          totalSize: 0
        }
    };

    $scope.createCores = function () {
        $scope.config.cores = [];
        var i;
        for (i = 0; i < $scope.config.coresNumber; i++) {
            $scope.config.cores.push({
                id: i,
                state: 'Parado',
                tempo: $scope.config.quantum,
                process: {}
            });
        }
        if(!$scope.config.coresNumber || $scope.config.coresNumber < 1 || $scope.config.coresNumber > 64){
            toastr["error"]("Invalid number of Cores.");
            return
        }else if($scope.config.processos < 1){
            toastr["error"]("Invalid number of Processos.");
            return
        }
        $scope.config.running = true;

        $rootScope.$broadcast('iniciar', $scope.config);
    }

    $scope.parar = function () {
        $scope.config.processadores = [];
        $scope.config.running = false;
        $rootScope.$broadcast('parar');
    }
});
