package taskManager;

import java.util.List;

public class Main {

    public static void main(String[] args) {

        List<Funcao> funcoes = AcessoDados.leArquivo("C:\\Users\\juanf\\Downloads\\taskManager.csv");

        System.out.println("");
        System.out.println("No teste animais");

        for(Funcao funcao: funcoes){
            System.out.println(funcao);
        }

        funcoes.add(new Funcao());
        //animais.add(new Animal("francis", 7, 2));

        System.out.println("");
        //System.out.println("No teste animais depois de incluir um animal novo");

        for(Funcao funcao: funcoes){
            System.out.println(funcao);
        }

      /* for(int i=0; i<funcoes.size(); i++){
        	Funcao funcao = funcoes.get(i);
            if(funcao.get().equals()){
                funcoes.remove(i);
                break;
            }
        }*/

        System.out.println("");
        System.out.println("No teste animais depois de retirar o vacilo");

       AcessoDados.saveArquivo(funcoes, "C:\\\\Users\\\\juanf\\\\Downloads\\\\taskManager.csv");



    }

}