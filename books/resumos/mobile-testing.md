## Ficha Técnica
- Título: Mobile Testing
- Autor: Jonathan Kohl
- Ano: 2014
- Categoria: Tecnologia

## A Ideia Central
Teste mobile é diferente: múltiplos dispositivos, orientações, conexões, interruções (chamadas, SMS). Não basta rodar em emulador no seu Mac. Precisamos de estratégia específica para fragmentação extrema.

## Conceitos-Chave

**1. Fragmentação de Dispositivos**
Android: 1000+ combinações de device/OS/screen-size/manufacturer customizations. iOS: limitado mas ainda variável. Impossível testar tudo. Estratégia: testar combinações mais comuns (90% dos users), e2e em poucos, regressão na maioria.

**2. Comportamentos Específicos Mobile**
App pode ser interrompido (chamada entra), backgroundado (usuário sai), congelado (OS mata por memória). Teste: app aborta, usuário volta 30min depois — dados preservados? Teste interruptions: chamada durante upload.

**3. Conectividade Variável**
Desktop: conectado ou offline. Mobile: 4G → 3G → WiFi → sem sinal, tudo no mesmo dia. Teste throttling: simular conexão lenta, perda de sinal. App trata gracefully?

**4. Orientação e Screen Size**
App em portrait, usuário roda para landscape — estado preservado? Layout redimensiona? Teste ambas orientações. Telas: phone (5"), phablet (6"), tablet (10") — UI adapta?

**5. Automação vs Manual**
Automação: testes rápidos, regressão, integração. Manual: exploração, interações gestuais complexas (pinch, swipe), sensores (accelerometer, GPS). Hybrid approach.

**6. Plataforma: iOS vs Android**
iOS: XCUITest (automação oficial). Android: Espresso (Google), Appium (cross-platform). Diferente ferramental, padrões distintos. Considerar CI/CD — rodar testes em emuladores é lento.

## Aplicação Prática
1. **Defina matrix**: top 10 combinações device/OS, teste todas.
2. **Emulador + Device Real**: emulador para rápido, device real para validação.
3. **Teste Interruptions**: simule chamadas, SMS, notificações durante app.
4. **Teste Orientação**: landscape/portrait transitions, estado preservado.
5. **Teste Conectividade**: WiFi ligado/desligado, throttling, latência.
6. **Automação Seletiva**: regressão crítica automatizada, novo/exploração manual.

## Frase Marcante
> "Testes mobile precisam lidar com realidade: dispositivos caem, redes falham, apps são backgroundados."

## Vale a Pena Ler o Livro Completo Se...
Você está iniciando testes mobile com exemplos em Espresso/XCUITest, padrões de automação para apps, como escalar testes cross-device, e cloud testing platforms que permitem rodar em reais devices.
