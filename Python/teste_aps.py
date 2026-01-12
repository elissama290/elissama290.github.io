def calcular_c(m,e,n):
   c = (m**e)%n
   return c

def remover_ultimo_caractere(texto):
    return texto[:-1]

import random
mensagem = str(input('Digite uma mensagem:'))

mensagem_desmontada = list(mensagem)
print('resultado:', mensagem_desmontada)

#caracteres = ['a', 'b', 'c', 'd', 'e']

numeros_disponiveis = list(range(1, len(mensagem_desmontada)+1))

associacoes = {}

# Criar associações caracteres -> números
for char in mensagem_desmontada:
    numero_aleatorio = random.choice(numeros_disponiveis)
    associacoes[char] = numero_aleatorio
    numeros_disponiveis.remove(numero_aleatorio)

# Substituir caracteres pelos números correspondentes na lista

lista_numeros = [associacoes[caracter] for caracter in mensagem_desmontada]

print("Associações de caracteres a números:")
for char, numero in associacoes.items():
    print(f"{char} -> {numero}")

print("Lista original de caracteres:", mensagem_desmontada)
print("Lista com números correspondentes:", lista_numeros)
chave_para_envio=[]
e = 17
n = 33
mensagem_cripto = ""

def remover_ultimo_caractere(texto):
    return texto[:-1]

for numero in lista_numeros:
    c = calcular_c(numero,17,33)
   # chave_para_envio.append(c)
    mensagem_cripto = mensagem_cripto + str(c) + "."
    
#print(chave_para_envio)
print("mensagem criptografada: ", mensagem_cripto)
#print(remover_ultimo_caractere(mensagem_cripto).split('.'))
lista_decripto = remover_ultimo_caractere(mensagem_cripto).split('.')

mensagem_decripto = ""
lista_decripto_int =[]
for numero in lista_decripto:
    lista_decripto_int.append(int(numero))
print(lista_decripto_int)
for numero in lista_decripto_int:
    c = calcular_c(numero,13,33)
    chave_para_envio.append(c)
    #mensagem_decripto = mensagem_decripto + str(c) + "."
    
print("Mensagem decripto:", chave_para_envio)
#lista_revers   = [associacoes[caracter] for caracter in lista]
associacao_reversa=[]
for numero in chave_para_envio :
    associacao_reversa.append([chave for chave, valor in associacoes.items() if valor == numero][0])

mensagem_final = ""
cont = 0
for char in associacao_reversa:
    mensagem_final += associacao_reversa[cont]
    cont = cont + 1


     
print("Lista reversa:", associacao_reversa)
print("Mensagem Final:", mensagem_final)

#print(mensagem_decripto)
#print(remover_ultimo_caractere(mensagem_decripto).split('.'))