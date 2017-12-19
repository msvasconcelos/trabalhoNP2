sistemasOperacionais.controller('processController',
      function ($rootScope, $scope, $interval,MemoryHelper,
        AlgorithmFactoryService,MemoryAlgorithmFactoryService, MemorySwappingService) {
    var service;
    var memoryService;
    var memorySwapping;

    $scope.processos = [];
    $scope.filaDePrioridade = [[], [], [], []];
    $scope.config;


    $scope.$on('iniciar', function (events, args) {
        $scope.config = args;

    

        service = AlgorithmFactoryService.buildAlgorithm($scope.config.algoritmo);
        memoryService = MemoryAlgorithmFactoryService.buildAlgorithm($scope.config.memoryAlgoritmo);
        memorySwapping = MemorySwappingService;
        service.configurar(args);
        iniciarMemoria(memoryService,args);
        createProcess(service, memoryService, args.processos);
        $scope.filaDePrioridade = service.filaDePrioridade;

        service.executar(memoryService, memorySwapping);
    });

    $scope.$on('parar', function (events, args) {
        $scope.getProcessos().length = 0;
    });

    var createProcess = function (service, memoryService, processos) {
        $scope.getProcessos().length = 0;
        $scope.filaDePrioridade.length = 0;

        for (var i = 0; i < processos; i++) {
            $scope.addProccess();
        }
    }

    $scope.getProcessos = function () {
        return $scope.processos;
    }

    $scope.addProccess = function () {

        service.createProcess($scope.getProcessos(), memoryService);
    };

    var iniciarMemoria = function (memoryService,args) {
        args.memory.totalSize = args.totalMemory;
        args.memory.size = args.totalMemory;
        memoryService.config = args;
        memoryService.memoryBlock = args.memoryBlock;
        memoryService.memory = args.memory;
        memoryService.memory.size = args.totalMemory;
        memoryService.memory.totalSize = args.totalMemory;
        MemoryHelper.setMemory(memoryService.memory);
    }
});
