const apiKey = "7de3166357a5d653fadff2f889c2271e";
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");

// Função de busca pelo nome
function buscarCidade() {
    let city = cityInput.value.trim();

    if (city === "") {
        alert("Digite o nome de uma cidade!");
        return;
    }

    city = encodeURIComponent(city);

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=pt_br&units=metric`)
        .then(response => {
            if (!response.ok) throw new Error("Cidade não encontrada ou problema na API!");
            return response.json();
        })
        .then(data => mostrarClima(data))
        .catch(error => {
            limparCampos();
            alert(error.message);
        });
}

// Clique no botão 🔍
searchBtn.addEventListener("click", buscarCidade);

// Pressionar Enter no campo de texto
cityInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        event.preventDefault(); // evita recarregar a página
        buscarCidade();
    }
});

// 📍 Buscar automaticamente pela localização do usuário
window.onload = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        alert("Geolocalização não é suportada no seu navegador.");
    }
};

// Sucesso → pega latitude e longitude
function success(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=pt_br&units=metric`)
        .then(response => response.json())
        .then(data => mostrarClima(data))
        .catch(error => {
            console.error("Erro ao buscar clima:", error);
        });
}

// Erro de localização
function error(err) {
    console.warn("Erro de geolocalização:", err.message);
}

// Função que mostra o clima no HTML
function mostrarClima(data) {
    document.getElementById("cityName").textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById("temperature").textContent = `🌡️ Temperatura: ${data.main.temp}°C`;
    document.getElementById("description").textContent = `☁️ Condição: ${data.weather[0].description}`;
    document.getElementById("humidity").textContent = `💧 Umidade: ${data.main.humidity}%`;
    document.getElementById("wind").textContent = `💨 Vento: ${data.wind.speed} m/s`;
}

// Função para limpar caso dê erro
function limparCampos() {
    document.getElementById("cityName").textContent = "";
    document.getElementById("temperature").textContent = "";
    document.getElementById("description").textContent = "";
    document.getElementById("humidity").textContent = "";
    document.getElementById("wind").textContent = "";
}
