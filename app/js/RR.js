/*SIMULADOR DE PROCESSOS*/

//Variaveis Globais:
var idProcessos = 0;
var fpp = -1;
var totalProcessadores;
var totalProcessosIniciais;
var quantumBase;
var executando;

var processador = new Array();
var filap0 = new Array();
var filap1 = new Array();
var filap2 = new Array();
var filap3 = new Array();
var filaProntos = new Array();

var quantumFilaPrioridade0;
var quantumFilaPrioridade1;
var quantumFilaPrioridade2;
var quantumFilaPrioridade3;

//CONSTRUTOR
function consProcesso(){
	var id;
	var tempoVida;
	var tempoRestante;
	var filaPrioridade;
	var quantum;	
}


/*CORPO DA SIMULACAO*/
function acao(){

	//Variavel de validacoes:
	var ValidacaoQuantum = validacaoCampos("fquantum", "quantum");
	var ValidacaoNumeroProcessosIniciais = validacaoCampos("fnProcessos", "número de processos iniciais");
	var ValidacaoProcessadores = validacaoCampos("fnProcessadores", "número de processadores");

	//Apos a validação iniciando o processo de simulacao:
	if(ValidacaoProcessadores && ValidacaoNumeroProcessosIniciais && ValidacaoQuantum){

		//Desabilitando os campos do formulario ou botão até a finalização do processamento:
		document.getElementById("fquantum").disabled = true;
		document.getElementById("fnProcessos").disabled = true;
		document.getElementById("fnProcessadores").disabled = true;
		document.getElementById("iniciar").disabled = true;

		//Habilitando o botão adicionar processos:
		document.getElementById("adicionar").disabled = false;

		//Inserido no HTML o tamanho do Quantum:
		quantumBase = document.getElementById("fquantum").value;
		document.getElementById("Cquantum").innerHTML = quantumBase;

		//Criando Processos e inserindo na Fila de espera:
		totalProcessosIniciais = document.getElementById("fnProcessos").value;
		CriacaoProcessos(totalProcessosIniciais, null);
		
		//Inserindo elementos no(s) processador(es):
		totalProcessadores = document.getElementById("fnProcessadores").value;
		inserirElementoProcessador(null, null);

		//Iniciando os processamentos:
		executando = setInterval("Processador()",1000);
					
		console.log("/////////////////////");
		console.log("Fila do Processador");
		for(var i=0 ; i<processador.length; i++){
			console.log(processador[i]);	
		}	
		
	}
}


//BOTÃO ADICIONAR PROCESSOS:
function btAdicionarProcessos(){
	CriacaoProcessos(1, 1);
}


//CRIACAO DOS PROCESSOS:
function CriacaoProcessos(totalProcessos, tipo){

	if(tipo == null){
		for(var x = 0; x<totalProcessos; x++){

			var objetoProcessos = new consProcesso(); 
			var tempoDeVida = Math.floor((Math.random()*16)+4); //tempo entre 16 e 4.
			var nFilaPrioridade = Math.floor((Math.random()*4)+0);//tempo entre 3 e 0.

			//Adicionando os elementos no Objeto:
			objetoProcessos.id = idProcessos;
			objetoProcessos.tempoVida = tempoDeVida;
			objetoProcessos.tempoRestante = tempoDeVida;
			objetoProcessos.filaPrioridade = nFilaPrioridade;

			//Incrementando o Quantum de acordo com as prioridades:
			if(nFilaPrioridade == 0){
				quantumFilaPrioridade0 = parseInt(quantumBase) + 1;
				objetoProcessos.quantum = quantumFilaPrioridade0;
			}else{
				if(nFilaPrioridade == 1){
					quantumFilaPrioridade1 = parseInt(quantumBase) + 2;
					objetoProcessos.quantum = quantumFilaPrioridade1;
				}else{
					if(nFilaPrioridade == 2){
						quantumFilaPrioridade2 = parseInt(quantumBase) + 3;
						objetoProcessos.quantum = quantumFilaPrioridade2;
					}else{
						quantumFilaPrioridade3 = parseInt(quantumBase) + 4;
						objetoProcessos.quantum = quantumFilaPrioridade3;
					}
				}
			}
			
			//Inserindo elemento na Fila:
			inserirElementoFila(objetoProcessos);
			idProcessos++;
		}		
	}else{

		for(var x = 0; x<totalProcessos; x++){

			var objetoProcessos = new consProcesso(); 
			var tempoDeVida = Math.floor((Math.random()*16)+4); //tempo entre 16 e 4.
			var nFilaPrioridade = Math.floor((Math.random()*4)+0);//tempo entre 3 e 0.

			//Adicionando os elementos no Objeto:
			objetoProcessos.id = idProcessos;
			objetoProcessos.tempoVida = tempoDeVida;
			objetoProcessos.tempoRestante = tempoDeVida;
			objetoProcessos.filaPrioridade = nFilaPrioridade;

			//Incrementando o Quantum de acordo com as prioridades:
			if(nFilaPrioridade == 0){
				quantumFilaPrioridade0 = parseInt(quantumBase) + 1;
				objetoProcessos.quantum = quantumFilaPrioridade0;
			}else{
				if(nFilaPrioridade == 1){
					quantumFilaPrioridade1 = parseInt(quantumBase) + 2;
					objetoProcessos.quantum = quantumFilaPrioridade1;
				}else{
					if(nFilaPrioridade == 2){
						quantumFilaPrioridade2 = parseInt(quantumBase) + 3;
						objetoProcessos.quantum = quantumFilaPrioridade2;
					}else{
						quantumFilaPrioridade3 = parseInt(quantumBase) + 4;
						objetoProcessos.quantum = quantumFilaPrioridade3;
					}
				}
			}
			
			//Inserindo elemento na Fila:
			inserirElementoFila(objetoProcessos, 1);
			idProcessos++;
		}		

	}
}


//INSERINDO ELEMENTOS NA FILA DE ACORDO COM SUA PRIORIDADE:
function inserirElementoFila(objeto, btAdicionar){

	switch(objeto.filaPrioridade){
		
		case 0:
			if(objeto.tempoRestante == 0){
				inserirElementoPronto(objeto);
			}else{
				if(btAdicionar == null){
					filap0[filap0.length] = objeto;
					//Inserindo elemento no HTML:
					addTAGs("filap"+objeto.filaPrioridade, "li", objeto.id, "bordar espera", 1, null);	
				}else{
					filap0[filap0.length] = objeto;
					//Inserindo elemento no HTML:
					addTAGs("filap"+objeto.filaPrioridade, "li", objeto.id, "bordar espera adicionado", 1, null);	
				}			
			}
		break;
		
		case 1:
			if(objeto.tempoRestante == 0){
				inserirElementoPronto(objeto);
			}else{
				if(btAdicionar == null){
					filap1[filap1.length] = objeto;
					//Inserindo elemento no HTML:
					addTAGs("filap"+objeto.filaPrioridade, "li", objeto.id, "bordar espera", 1, null);						
				}else{
					filap1[filap1.length] = objeto;
					//Inserindo elemento no HTML:
					addTAGs("filap"+objeto.filaPrioridade, "li", objeto.id, "bordar espera adicionado", 1, null);						
				}				
			}		
		break;

		case 2:
			if(objeto.tempoRestante == 0){
				inserirElementoPronto(objeto);
			}else{
				if(btAdicionar == null){
					filap2[filap2.length] = objeto;
					//Inserindo elemento no HTML:
					addTAGs("filap"+objeto.filaPrioridade, "li", objeto.id, "bordar espera", 1, null);	
				}else{
					filap2[filap2.length] = objeto;
					//Inserindo elemento no HTML:
					addTAGs("filap"+objeto.filaPrioridade, "li", objeto.id, "bordar espera adicionado", 1, null);	
				}				
			}		
		break;

		case 3:
			if(objeto.tempoRestante == 0){
				inserirElementoPronto(objeto);
			}else{
				if(btAdicionar == null){
					filap3[filap3.length] = objeto;
					//Inserindo elemento no HTML:
					addTAGs("filap"+objeto.filaPrioridade, "li", objeto.id, "bordar espera", 1, null);	
				}else{
					filap3[filap3.length] = objeto;
					//Inserindo elemento no HTML:
					addTAGs("filap"+objeto.filaPrioridade, "li", objeto.id, "bordar espera adicionado", 1, null);						
				}				
			}
		break;

		default:
			alert("Não foi possível criar o(s) processo(s) na(s) fila(s) de prioridade(s).");
		break;
	}

}

//INSERIR ELEMENTO NO PROCESSADOR:  fp - Fila de Prioridade e pv - Posicao do vetor 
function inserirElementoProcessador(fp,pv){

	if(fp == null){
		var n = 0;
		for(var x = 0; x < totalProcessadores; x++){
			if(n <= 3){
				var objetoFila = removerElementoFila(n);

				if(objetoFila != null){
					processador[processador.length] = objetoFila;
				
					//Inserindo elemento no HTML:
					addTAGs("Nprocessos", "div", objetoFila.id, "molder", 2, objetoFila);								
					n++;
				}

			}else{
				n = 0;
				x--;
			}		
		}		
	}else{
		var objetoFila = removerElementoFila(fp);
		console.log("Novo Objeto a ser inserido: "+ objetoFila);
		processador.splice(pv, 0, objetoFila);

		for(var y=0; y < processador.length; y++){
			removerTAGs("Nprocessos", processador[y].id);
		}
		for(var w=0; w < processador.length; w++){				
			//Inserindo elemento no HTML:
			addTAGs("Nprocessos", "div", processador[w].id, "molder", 2, processador[w]);	
		}							
	}
}

function inserirElementoPronto(objeto){

	var objetoProcessos = new consProcesso();
	objetoProcessos = objeto;

	if(objetoProcessos != null){
		filaProntos[filaProntos.length] = objetoProcessos;
		//Inserindo elemento no HTML:
		addTAGs("filapronta", "li", objetoProcessos.id, "bordar pronto", 1, null);
	}

}


//REMOVENDO O(s) PRIMEIRO(s) ELEMENTO(s) DA FILA DE PRIORIDADE E RETORNANDO O PRIMEIRO ELEMENTO DA FILA:
function removerElementoFila(numero){

var temp = null;
var validacao = false;
	
	while(validacao != true){
		switch(numero){
				
				case 0:
					if(filap0[0] == null){
						numero = 1;
					}else{
						temp = filap0[0];
						removerTAGs("filap"+numero, temp.id);
						filap0.shift();
						validacao = true;
					}
				break;
				
				case 1:
					if(filap1[0] == null){
						numero = 2;
					}else{
						temp = filap1[0];
						removerTAGs("filap"+numero, temp.id);
						filap1.shift();
						validacao = true;
					}				
				break;

				case 2:
					if(filap2[0] == null){
						numero = 3;
					}else{
						temp = filap2[0];
						removerTAGs("filap"+numero, temp.id);
						filap2.shift();
						validacao = true;
					}					
				break;

				case 3:
					if(filap3[0] == null){
						numero = 4;
					}else{
						temp = filap3[0];
						removerTAGs("filap"+numero, temp.id);
						filap3.shift();
						validacao = true;
					}			
				break;

				case 4:
					if(filap0[0] == null &&	filap1[0] == null && filap2[0] == null && filap3[0] == null){
						validacao = true;
					}else{
						numero = 0;
					}
				break;

				default:
					alert("Não foi possível remover processo(s) da fila de prioridade");
				break;
			}
	}
	//console.log("Saiu da função removerElementoFila");
	return temp;
}


//REMOVENDO ELEMENTO DO PROCESSADOR:
function removerElementoProcessador(posicao, objeto){
	processador.splice(posicao, 1);
	removerTAGs("Nprocessos", objeto.id);
}


//PROCESSADOR:
function Processador(){

	//Condição para parada:
	if(processador.length != 0){

		for(var i = 0; i<processador.length; i++){

			var idCampo = "Quant"+processador[i].id;
			var idVidaDoProcesso = "tR"+processador[i].id;

			var campoQuantum = document.getElementById(idCampo).innerHTML;
			var campoVidaDoProcesso = document.getElementById(idVidaDoProcesso).innerHTML;

			if(campoQuantum > 0){

				//Decrementa o Campo do Quantum no processador:
				campoQuantum = parseInt(campoQuantum)-1;
				//Insere novamente no html o novo Quantum do processador:
				document.getElementById(idCampo).innerHTML = campoQuantum;
				processador[i].quantum = campoQuantum;

				//Decrementa o campo Tempo de vida do processador:
				campoVidaDoProcesso = parseInt(campoVidaDoProcesso)-1;
				//Insere novamente no html o novo tempo de vida do processador:
				document.getElementById(idVidaDoProcesso).innerHTML = campoVidaDoProcesso;
				//Insere no objeto do processador para ser salvo:
				processador[i].tempoRestante = campoVidaDoProcesso;

				//Verificando se o processador tem espaço vazio e tem processos:
				for(var w = totalProcessadores; w > processador.length; w--){

					console.log("Total de núcleos: "+totalProcessadores+"> Tamanho do processador: "+processador.length);
					if(filap0.length >= 1 || 
						filap1.length >= 1 || 
						 filap2.length >= 1 || 
						  filap3.length >= 1){

						var proximaFilaPrioridade = ultimaPosicaoFilaPrioridade();
						inserirElementoProcessador(proximaFilaPrioridade, processador.length);
					}

				}	

				//Verificando se no campo tempo de vida do processo é igual a 0:
				if(campoVidaDoProcesso == 0){
					//Insere na fila de pronto:
					inserirElementoPronto(processador[i]);

					//Removendo o Processo do Processador:
					removerElementoProcessador(i, processador[i]);

					//Verificando se as filas de prioridades contem conteudo:
					if(filap0.length >= 1 || 
						filap1.length >= 1 || 
						 filap2.length >= 1 || 
						  filap3.length >= 1){

						var proximaFilaPrioridade = ultimaPosicaoFilaPrioridade();
						var posicaoArrayProcessador = i;
						inserirElementoProcessador(proximaFilaPrioridade, posicaoArrayProcessador);

						console.log("/////////////////////");
						console.log("Fila do Processador");
						for(var i=0 ; i<processador.length; i++){
							console.log(processador[i]);	
						}						
					}
				}
			}else{

				if(processador[i].filaPrioridade == 0){
					processador[i].quantum = quantumFilaPrioridade0;
				}
				
				if(processador[i].filaPrioridade == 1){
					processador[i].quantum = quantumFilaPrioridade1;
				}
				
				if(processador[i].filaPrioridade == 2){
					processador[i].quantum = quantumFilaPrioridade2;
				}
				
				if(processador[i].filaPrioridade == 3){
					processador[i].quantum = quantumFilaPrioridade3;
				}
				

				var proximaFilaPrioridade = ultimaPosicaoFilaPrioridade();
				var objetoProcesso = processador[i];
				var posicao = i;
				removerElementoProcessador(i, processador[i]);
				inserirElementoFila(objetoProcesso, null);
				inserirElementoProcessador(proximaFilaPrioridade, posicao);

				console.log("/////////////////////");
				console.log("Fila do Processador");
				for(var i=0 ; i<processador.length; i++){
					console.log(processador[i]);	
				}	
			}
		}
	}else{
		//Habilitando os campos do formulario ou botão:
		document.getElementById("fquantum").disabled = false;
		document.getElementById("fnProcessos").disabled = false;
		document.getElementById("fnProcessadores").disabled = false;
		document.getElementById("iniciar").disabled = false;
		document.getElementById("adicionar").disabled = true;
		//Parando de executar o Processador:
		clearInterval(executando);		
	} 
}


//ADICIONANDO TAG no HTML:
function addTAGs(idSeletor, tag, idFilho, classFilho, codigoExibicao, objeto){
	//Acessando o elemento Pai:
	var objPai = document.getElementById(idSeletor);

    //Criando o elemento DIV;
    var objFilho = document.createElement(tag);

    //Definindo atributo ao objFilho: (ID)
    objFilho.setAttribute("id", idFilho);
        
    //Definindo Atributo ao objFilho (Class):
    objFilho.setAttribute("class", classFilho);        

    //Inserindo o elemento no pai:
    objPai.appendChild(objFilho);

    if(codigoExibicao == 1){
	    //Escrevendo algo no filho recém-criado:
		objFilho.innerHTML = idFilho;
	}else{
	    //Escrevendo algo no filho recém-criado:
		objFilho.innerHTML = "ID: "+idFilho+
													 "<br>Tempo de vida: "+objeto.tempoVida+
													 "<br><span class='posicao'>Tempo Restante: </span><div class='posicao' id='tR"+idFilho+"'>"+objeto.tempoRestante+"</div>"+
													 "<span class='posicao'>Quantum:</span><div class='posicao' id='Quant"+idFilho+"'> "+objeto.quantum+"</div><br>"+
													 "<br>Fila: "+objeto.filaPrioridade;		
	}
}

//REMOVENDO TAG no HTML:
function removerTAGs(idSeletor, idfilho) {

	//console.log("REMOVENDO: Fila"+idSeletor+" id do filho"+ idfilho);
    
    var objPai = document.getElementById(idSeletor);
    var objFilho = document.getElementById(idfilho);

    //Verificando se o Objeto existe antes de removelo:
    if(objFilho != null){
    	//Removendo o DIV com id específico do nó-pai:
    	var removido = objPai.removeChild(objFilho);
    }
}


function addTAGsLocalEspecifico(tagPosterior, idFilho, classes, objeto){

	var idTag = "#x"+tagPosterior;
	console.log("Antes do id:"+idTag);
	var elemento = document.querySelector(idTag);

	var elementoInserir = "<div id='x"+idFilho+"' class='"+classes+"'>"+
							"ID: "+idFilho+
							"<br>Tempo de vida: "+objeto.tempoVida+
							"<br><span class='posicao'>Tempo Restante: </span><div class='posicao' id='tR"+idFilho+"'>"+objeto.tempoRestante+"</div>"+
							"<span class='posicao'>Quantum:</span><div class='posicao' id='Quant"+idFilho+"'> "+objeto.quantum+"</div><br>"+
							"<br>Fila: "+objeto.filaPrioridade;

	elemento.insertAdjacentHTML('beforebegin', elementoInserir);
}


//VALIDACAO DOS CAMPOS DO FORMULÁRIO:
function validacaoCampos(nomeCampo, textoImpressao){
	var x = document.getElementById(nomeCampo).value;
	if( x == 0 || x == "" || x == null){
		alert("O campo do(a) "+ textoImpressao +" não poderá ficar em branco ou ser zerado.");
		return false;
	}else{
		return true;
	}
}


//ULTIMA POSICAO DA FILA DE PRIORIDADE
function ultimaPosicaoFilaPrioridade(){
	if(fpp == 3){
		fpp = 0;
	}else{
		fpp++;
	}
	console.log("Fila de Prioridade: "+ fpp);
	return fpp;
}
