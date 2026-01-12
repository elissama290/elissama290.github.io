import random

def is_prime(num):
    if num <= 1:
        return False
    if num <= 3:
        return True
    if num % 2 == 0 or num % 3 == 0:
        return False
    i = 5
    while i * i <= num:
        if num % i == 0 or num % (i + 2) == 0:
            return False
        i += 6
    return True

def gerar_lista_de_primos(minimo, maximo):
    primos = [num for num in range(minimo, maximo + 1) if is_prime(num)]
    return primos

def gerar_dois_primos_aleatorios(primos):
    if len(primos) < 2:
        return None, None
    primeiro_primo = random.choice(primos)
    segundo_primo = random.choice([p for p in primos if p != primeiro_primo])
    return primeiro_primo, segundo_primo

minimo = 100
maximo = 1000
primos_no_intervalo = gerar_lista_de_primos(minimo, maximo)

primeiro_primo, segundo_primo = gerar_dois_primos_aleatorios(primos_no_intervalo)

print("Primeiro número primo aleatório:", primeiro_primo)
print("Segundo número primo aleatório:", segundo_primo)

produto = primeiro_primo * segundo_primo
print("Produto dos dois números primos:", produto)


totiente_n = (primeiro_primo - 1) * (segundo_primo - 1)
print("Valor da função totiente :", totiente_n)
