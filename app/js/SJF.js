/*SIMULADOR DE PROCESSOS*/

//Variaveis Globais:
var idProcessos = 0;
var totalProcessadores;
var totalProcessosIniciais;
var executando;
var idAddProcesso;

var processador = new Array();
var filaEspera = new Array();
var filaProntos = new Array();
//var filaAbortado = new Array();
//var auxiliar = new Array();

var segundo = 0+"0";
var minuto = 0+"0";
var hora = 0+"0";

//CONSTRUTOR
function consProcesso(){
	var id;
	var tempoExecucao;
	var tempoRestante;
//	var deadLine;	
}


/*CORPO DA SIMULACAO*/
function acao(){

	//Variavel de validacoes:
	var ValidacaoNumeroProcessosIniciais = validacaoCampos("fnProcessos", "número de processos iniciais");
	var ValidacaoProcessadores = validacaoCampos("fnProcessadores", "número de processadores");

	//Apos a validação iniciando o processo de simulacao:
	if(ValidacaoProcessadores && ValidacaoNumeroProcessosIniciais){

		//Desabilitando os campos do formulario ou botão até a finalização do processamento:
		document.getElementById("fnProcessos").disabled = true;
		document.getElementById("fnProcessadores").disabled = true;
		document.getElementById("iniciar").disabled = true;

		//Habilitando o botão adicionar processos:
		document.getElementById("adicionar").disabled = false;

		//Criando os processos e inserindo na fila de espera
		totalProcessosIniciais = document.getElementById("fnProcessos").value;
		CriacaoProcessos(totalProcessosIniciais, null);

		//Ordenando por tempo de Execucao:
		auxiliar = mergeSort(filaEspera);
		filaEspera = auxiliar;

		//Desenhando os elementos ordenados na fila de espera:
		DesenhaElementoOrdenadoEspera();

		//Inserindo elementos no(s) processador(es):
		totalProcessadores = document.getElementById("fnProcessadores").value;
		inserirElementoProcessador(null);

		//Iniciando os processamentos:
		executando = setInterval("Processador()",1000);				
	}
}


//BOTÃO ADICIONAR PROCESSOS:
function btAdicionarProcessos(){
	CriacaoProcessos(null, 1);
	auxiliar = mergeSort(filaEspera);
	filaEspera = auxiliar

	for(var k=0; k<filaEspera.length; k++){
		removerTAGs("NDeadLine", filaEspera[k].id);
	}

	for(var r=0; r<filaEspera.length; r++){
		if(idAddProcesso == filaEspera[r].id){
			//Inserindo elemento no HTML:
			addTAGs("NDeadLine", "div", filaEspera[r].id, "molderProcessoAdd", 2, filaEspera[r]);			
		}else{
			//Inserindo elemento no HTML:
			addTAGs("NDeadLine", "div", filaEspera[r].id, "molderProcesso", 2, filaEspera[r]);			
		}
	}
}


//CRIACAO DOS PROCESSOS:
function CriacaoProcessos(totalProcessos, tipo){

	if(tipo == null){

		for(var x = 0; x<totalProcessos; x++){

			var objetoProcessos = new consProcesso(); 
			var tempoExec = Math.floor((Math.random()*20)+1); //tempo entre 20 e 0.
			

			//Adicionando os elementos no Objeto:
			objetoProcessos.id = idProcessos;
			objetoProcessos.tempoExecucao = tempoExec;
			objetoProcessos.tempoRestante = tempoExec;
			
		
			//Inserindo elemento na Fila:
			inserirElementoEspera(objetoProcessos);
			idProcessos++;
		}	

	}else{
			var objetoProcessos = new consProcesso(); 
			var tempoExec = Math.floor((Math.random()*20)+1); //tempo entre 20 e 0.
			

			//Adicionando os elementos no Objeto:
			objetoProcessos.id = idProcessos;
			objetoProcessos.tempoExecucao = tempoExec;
			objetoProcessos.tempoRestante = tempoExec;
			

		
			//Inserindo elemento na Fila:
			inserirElementoEspera(objetoProcessos);
			idAddProcesso = idProcessos;
			idProcessos++;		
	}
}


//INSERINDO ELEMENTOS NA FILA DE ACORDO COM SUA PRIORIDADE:
function inserirElementoEspera(objeto){
	filaEspera[filaEspera.length] = objeto;
}


//INSERIR ELEMENTO NO PROCESSADOR:  pv - Posição do vetor                 
function inserirElementoProcessador(pv){

	if(pv == null){
		for(var x = 0; x < totalProcessadores; x++){

			var objetoFila = removerElementoEspera(null, null);
			if(objetoFila != null){
				processador[processador.length] = objetoFila;
				//Inserindo elemento no HTML:
				addTAGs("Nprocessos", "div", objetoFila.id, "molder1", 2, objetoFila);
			}	
										
		}
	}else{
		var objeto = removerElementoEspera(null, null);
		processador.splice(pv, 0, objeto);
		//Remove todos os elementos no HTML:
		for(var w=0; w<processador.length; w++){
			removerTAGs("Nprocessos", processador[w].id);
		}
		//Inserindo todos os elemento no HTML:
		for(var z=0; z<processador.length; z++){
			addTAGs("Nprocessos", "div", processador[z].id, "molder1", 2, processador[z]);
		}
	}

}


//INSERIR ELEMENTO NA FILA DE EXECUTADO:
function inserirElementoExecutado(objeto){
	filaProntos[filaProntos.length] = objeto;
	//Inserindo elemento no HTML:
	addTAGs("executado", "li", objeto.id, "bordar espera negrito", 1, null);
}





//REMOVENDO PRIMEIRO ELEMENTO DA FILA DE PRIORIDADE E RETORNANDO O PRIMEIRO ELEMENTO DA FILA:
function removerElementoEspera(posicao, objeto){
	if(posicao == null){

		var objeto = new consProcesso();

		do{
			objeto = filaEspera.shift();
			
			

		}while(objeto.deadLine == 0);

		if(objeto != null){
			removerTAGs("NDeadLine", objeto.id);
			return objeto;
		}else{
			return null;
		} 

	}else{
		filaEspera.splice(posicao,1);
		removerTAGs("NDeadLine", objeto.id);
	}
}

function removerElementoProcessador(posicao, objeto){
	processador.splice(posicao, 1);
	removerTAGs("Nprocessos", objeto.id);
}


function Processador(){

	//Condicao de parada:
	if(processador.length != 0){

		//Cronometro:
		tempo();


		for(var i=0; i<processador.length; i++){
			var idCampo = "tR"+processador[i].id;
			var CampoTempoRestante = document.getElementById(idCampo).innerHTML;

			if(CampoTempoRestante > 0){

				CampoTempoRestante = parseInt(CampoTempoRestante)-1;
				document.getElementById(idCampo).innerHTML = CampoTempoRestante;
				processador[i].tempoRestante = CampoTempoRestante;

				//Verificando se o processador tem espaço vazio e tem processos:
				for(var y = totalProcessadores; y > processador.length; y--){
					if(filaEspera.length >= 1){
						inserirElementoProcessador(i);
					}
				}

			}else{
				//Inseri o elemento na fila de Executados:
				inserirElementoExecutado(processador[i]);
				//Remove o elemento da fila do processador:
				removerElementoProcessador(i, processador[i]);
				//Proximo elemento a inserir no processador:
				if(filaEspera.length >= 1){
					inserirElementoProcessador(i);
				}
			}
		}


		for(var z=0; z<filaEspera.length; z++){
			var idCampo2 = "dL"+filaEspera[z].id;
			var CampoDeadLine = document.getElementById(idCampo2).innerHTML;

			if(CampoDeadLine > 0){

				CampoDeadLine = parseInt(CampoDeadLine)-1;
				document.getElementById(idCampo2).innerHTML = CampoDeadLine;
				filaEspera[z].deadLine = CampoDeadLine;

			}else{
				//Inseri o elemento na fila de Abortados:
				inserirElementoAbortado(filaEspera[z]);
				//Remove o elemento da fila de espera:
				removerElementoEspera(z, filaEspera[z]);
			}
		}

	}else{

		//Habilitando os campos do formulario ou botão:
		document.getElementById("fnProcessos").disabled = false;
		document.getElementById("fnProcessadores").disabled = false;
		document.getElementById("iniciar").disabled = false;
		document.getElementById("adicionar").disabled = true;

		//Parando de executar o Processador:
		clearInterval(executando);
	}

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


//FUNCAO PARA ORDERNAR:
function mergeSort(vetor){

    if (vetor.length < 2)
        return vetor;
 
    var meio = parseInt(vetor.length / 2);
    var esquerda   = vetor.slice(0, meio);
    var direita  = vetor.slice(meio, vetor.length);
 
    return merge(mergeSort(esquerda), mergeSort(direita));
}
function merge(esquerda, direita){

    var result = [];
 
    while (esquerda.length != 0 && direita.length != 0) {

        if (esquerda[0].tempoExecucao <= direita[0].tempoExecucao) {
            result.push(esquerda.shift());
        } else {
            result.push(direita.shift());
        }

    }
 
    while (esquerda.length)
        result.push(esquerda.shift());
 
    while (direita.length)
        result.push(direita.shift());
 	
    return result;

}
/*TERMINO DA FUNCOES PARA ORDENAR*/


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
													 "<br>Tempo de execução: "+objeto.tempoExecucao+
													 "<br><span class='posicao'>Tempo Restante: </span><div class='posicao' id='tR"+idFilho+"'>"+objeto.tempoRestante+"</div>"+
													 "<span class='posicao'>DeadLine:</span><div class='posicao' id='dL"+idFilho+"'> "+objeto.deadLine+"</div>";		
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


//DESENHANDO OS PROCESSOS NA FILA DE ESPERA:
function DesenhaElementoOrdenadoEspera(){

	for(var i = 0; i<filaEspera.length; i++){
		//Inserindo elemento no HTML:
		addTAGs("NDeadLine", "div", filaEspera[i].id, "molderProcesso", 2, filaEspera[i]);
	}
	
}

//Cronometro:
function tempo(){	

   if (segundo < 59){
      segundo++

      if(segundo < 10){
      	segundo = "0"+segundo
      }

   }else if(segundo == 59 && minuto < 59){
        segundo = 0+"0";
		minuto++;
		if(minuto < 10){
			minuto = "0"+minuto
		}
    }

   if(minuto == 59 && segundo == 59 && hora < 23){
      segundo = 0+"0";
      minuto = 0+"0";
      hora++;

      if(hora < 10){
      	hora = "0"+hora
      }

   }else if(minuto == 59 && segundo == 59 && hora == 23){
        segundo = 0+"0";
		minuto = 0+"0";
		hora = 0+"0";
   }

   document.getElementById("CTempo").innerHTML = hora +":"+ minuto +":"+ segundo;

}
