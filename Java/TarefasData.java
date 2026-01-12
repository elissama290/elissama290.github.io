package taskManager;

public class TarefasData {
	 private int dataDia;
	 private int dataMes;
	 private int dataAno;
		
	 public TarefasData(int dataDia, int dataMes, int dataAno) {
	  super();
	  this.dataDia = dataDia;
	  this.dataMes = dataMes;
	  this.dataAno = dataAno;
	 }
		
	 public int getDataDia() {
	  return dataDia;
	 }


	 public void setDataDia(int dataDia) {
	  this.dataDia = dataDia;
	 }


	 public int getDataMes() {
	  return dataMes;
	 }


	 public void setDataMes(int dataMes) {
	  this.dataMes = dataMes;
	 }


	 public int getDataAno() {
	  return dataAno;
	 }


	 public void setDataAno(int dataAno) {
	  this.dataAno = dataAno;
	 }
	}