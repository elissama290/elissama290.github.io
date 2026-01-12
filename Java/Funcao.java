package taskManager;

import java.util.ArrayList;
import java.util.List;

public class Funcao {

    public static void main(String[] args) {

        // Criando algumas atividades
        List<Atividade> listaAtividades = new ArrayList<>();
        listaAtividades.add(new Atividade(1, "Estudar Java"));
        listaAtividades.add(new Atividade(2, "Fazer exercícios de Java"));
        listaAtividades.add(new Atividade(3, "Praticar Java em projetos"));

        // ID da atividade a ser buscada
        int idNome = 2;

        // Buscando a atividade na lista
        Atividade atividadeEncontrada = buscarAtividadePorId(listaAtividades, idBuscado);

        if (atividadeEncontrada != null) {
            System.out.println("Atividade encontrada: " + atividadeEncontrada.getDescricao());
        } else {
            System.out.println("Atividade com o ID " + idNome + " não encontrada.");
        }
    }
    //funcao

    public static Atividade buscarAtividade(List<Atividade> listaAtividades, int idNome) {
        for (Atividade atividade : listaAtividades) {
            if (atividade.getNome() == idNome) {
                return atividade;
            }
        }
        return null; // Retornar null se a atividade não for encontrada
    }
}
}

}
