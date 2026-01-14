document.addEventListener("DOMContentLoaded", () => {

    const urlApi = 'https://termoapi.azurewebsites.net';
    // const urlApi = 'https://localhost:44363';

    const alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    const palmeiras = 'palmeiras_nao_tem_mundial';

    const greenLettersToBoard = [];
    const yellowLettersToBoard = [];
    const blackLettersToBoard = [];

    var colunaAtual = 1;
    var atualIndex = 1;
    var playerIp;
    var ganhou = false;
    var sp;

    Authenticate();

    // #region Autenticacao
    function Authenticate() {
        fetch(`${urlApi}/Auth/authorize/${palmeiras}`, { method: "GET" })
            .then((response) => {
                return response.text();
            })
            .then((data) => {
                sp = data;
                GetPlayerIP();
            })
            .catch((err) => {
                console.error(err);
            });
    }
    // #endregion

    // #region Popula palavras com o que ja temos na API

    function GetPlayerProgress() {
        fetch(`${urlApi}/World/GetPlayerTodayProgress?ipAdress=${playerIp}`, {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + sp
                }
            })
            .then((response) => {
                return response.json();
            })
            .then((data) => {

                if (!data) {
                    return;
                }

                for (var dataIndex in data) {

                    if (data[dataIndex].isSucces) {
                        for (var key in data[dataIndex].greenLetters) {
                            PreencheEspacos(true, key, data[dataIndex].greenLetters, 'letter right');
                            if (!greenLettersToBoard.includes(data[dataIndex].greenLetters[key].toLowerCase())) {
                                greenLettersToBoard.push(data[dataIndex].greenLetters[key].toLowerCase());
                            }
                        }

                        setTimeout(() => {
                            $("#stats").show();
                            GetPlayerStats(false);
                        }, 50);

                        MudaTelcadoVirtual();
                        ganhou = true;
                        return;
                    }

                    for (var key in data[dataIndex].yellowLetters) {
                        PreencheEspacos(true, key, data[dataIndex].yellowLetters, 'letter place');

                        var letra = data[dataIndex].yellowLetters[key].toLowerCase();

                        if (!greenLettersToBoard.includes(letra) && !yellowLettersToBoard.includes(letra)) {
                            yellowLettersToBoard.push(letra);
                        }
                    }

                    for (var key in data[dataIndex].greenLetters) {
                        PreencheEspacos(true, key, data[dataIndex].greenLetters, 'letter right');
                        if (!greenLettersToBoard.includes(data[dataIndex].greenLetters[key].toLowerCase())) {
                            greenLettersToBoard.push(data[dataIndex].greenLetters[key].toLowerCase());
                        }
                    }

                    for (var key in data[dataIndex].blackLetters) {
                        PreencheEspacos(true, key, data[dataIndex].blackLetters, 'letter wrong');

                        var letra = data[dataIndex].blackLetters[key].toLowerCase();

                        if (!greenLettersToBoard.includes(letra) && !yellowLettersToBoard.includes(letra) && !blackLettersToBoard.includes(letra)) {
                            blackLettersToBoard.push(letra);
                        }
                    }

                    colunaAtual++;
                    MudaTelcadoVirtual();

                    if (colunaAtual > 6) {
                        setTimeout(() => {
                            $("#stats").show();
                            GetPlayerStats(false);
                        }, 50);

                        ganhou = true;
                    }
                }
            })
            .then(() => {
                ShowPage();
            })
            .catch((err) => {
                console.error(err);
            });
    }


    // #endregion

    // #region Pega o IP do jogador
    function GetPlayerIP() {
        fetch(`https://api.ipify.org?format=json`, { method: "GET" })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                playerIp = data.ip;
                // playerIp = 12345611;
                GetPlayerProgress();
            })
            .catch((err) => {
                console.error(err);
            });
    }
    // #endregion

    // #region Receber letras do teclado do Player

    document.body.onkeydown = function KeyDownEvent(event) {

        if (ganhou) {
            return;
        }

        if (event.key == 'Backspace') {
            RemoverLetraQuandoApertaBackspace();
            return;
        }

        if (event.key == 'Enter') {
            EnviarPalavraQuandoApertaEnter();
            return;
        }

        if (alphabet.includes(event.key.toLowerCase()) && atualIndex <= 5) {
            var id = `${colunaAtual}-${atualIndex}`;
            const letterElement = document.getElementById(id);
            letterElement.innerHTML = event.key.toUpperCase();
            atualIndex++;
        }
    }

    function RemoverLetraQuandoApertaBackspace() {
        var id = `${colunaAtual}-${atualIndex-1}`;
        const letterElement = document.getElementById(id);
        letterElement.innerHTML = '';
        atualIndex--;
    }

    function EnviarPalavraQuandoApertaEnter() {

        if (atualIndex != 6) {
            return;
        }

        var worldSubmit = '';

        for (var i = 1; i <= 5; i++) {
            var id = `${colunaAtual}-${i}`;
            const letterElement = document.getElementById(id);
            worldSubmit += letterElement.innerText;
        }

        EnviarPalavra(worldSubmit);
    }

    // #endregion

    // #region Receber letras do teclado virtual

    const keys = document.querySelectorAll("#kbd button");

    for (let i = 0; i < keys.length; i++) {
        keys[i].onclick = ({ target }) => {

            if (ganhou) {
                return;
            }

            const letter = target.getAttribute("data-key");

            if (letter === "enter") {
                EnviarPalavraQuandoApertaEnter();
                return;
            }

            if (letter === "del") {
                RemoverLetraQuandoApertaBackspace();
                return;
            }

            if (alphabet.includes(letter.toLowerCase()) && atualIndex <= 5) {
                var id = `${colunaAtual}-${atualIndex}`;
                const letterElement = document.getElementById(id);
                letterElement.innerHTML = letter.toUpperCase();
                atualIndex++;
            }
        };
    }

    // #endregion

    // #region Envia palavra para API

    function EnviarPalavra(worldSubmit) {

        fetch(`${urlApi}/World/ValidateWorld?worldReceived=${worldSubmit}&ipAdress=${playerIp}&playerName=`, {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + sp
                }
            })
            .then((resp) => {

                if (resp.ok) {
                    return resp.json();
                }

                if (resp.status == 400) {

                    resp.json().then((data) => {
                        if (data.key == 'WORLD_MUST_BE_FIVE_CARACTERS') {
                            window.alert(data.message);
                        }

                        if (data.key == 'WORLD_DOES_NOT_EXISTS') {
                            Notify("Essa palavra nao está no banco de dados", 1000);
                            ErrouPalavra();
                        }

                        if (data.key == 'PLAYER_NOT_CAN_PLAY') {
                            window.alert(data.message);
                        }

                        return;
                    });

                    return;
                }

                window.alert(`Alguma coisa aconteceu :( Tente novamente mais tarde.`);
            })
            .then((data) => {
                if (data.isSucces) {
                    for (var key in data.greenLetters) {
                        PreencheEspacos(false, key, data.greenLetters, 'letter right');
                        if (!greenLettersToBoard.includes(data.greenLetters[key].toLowerCase())) {
                            greenLettersToBoard.push(data.greenLetters[key].toLowerCase());
                        }
                    }

                    switch (colunaAtual) {
                        case 1:
                            Notify("Explendido", 5000);
                            break;
                        case 2:
                            Notify("Incrível", 5000);
                            break;
                        case 3:
                            Notify("Maravilhoso", 5000);
                            break;
                        case 4:
                            Notify("Muito bem", 5000);
                            break;
                        case 5:
                            Notify("Boa", 5000);
                            break;
                        case 6:
                            Notify("Na ultima em", 5000);
                            break;
                    }

                    setTimeout(() => {
                        $("#stats").show();
                        GetPlayerStats(true);
                    }, 50);

                    MudaTelcadoVirtual();
                    ganhou = true;

                    return;
                }

                for (var key in data.yellowLetters) {
                    PreencheEspacos(true, key, data.yellowLetters, 'letter place');

                    var letra = data.yellowLetters[key].toLowerCase();

                    if (!greenLettersToBoard.includes(letra) && !yellowLettersToBoard.includes(letra)) {
                        yellowLettersToBoard.push(letra);
                    }
                }

                for (var key in data.greenLetters) {
                    PreencheEspacos(true, key, data.greenLetters, 'letter right');
                    if (!greenLettersToBoard.includes(data.greenLetters[key].toLowerCase())) {
                        greenLettersToBoard.push(data.greenLetters[key].toLowerCase());
                    }
                }

                for (var key in data.blackLetters) {
                    PreencheEspacos(true, key, data.blackLetters, 'letter wrong');

                    var letra = data.blackLetters[key].toLowerCase();

                    if (!greenLettersToBoard.includes(letra) && !yellowLettersToBoard.includes(letra) && !blackLettersToBoard.includes(letra)) {
                        blackLettersToBoard.push(letra);
                    }
                }

                colunaAtual++;
                atualIndex = 1;
                MudaTelcadoVirtual();
                $('#stats_games').text('-')

                if (colunaAtual > 6) {
                    Notify(data.world, -1);
                    setTimeout(() => {
                        $("#stats").show();
                        GetPlayerStats(true);
                    }, 50);

                    ganhou = true;
                }

            })
            .catch(ex => {
                console.log("ERRO: ", ex);
            });
    }

    // #endregion

    // #region Pega estatisticas do Player
    function GetPlayerStats(acabouDeGanhar) {

        if ($('#stats_games').text() != '-' && !acabouDeGanhar) {
            return;
        }

        fetch(`${urlApi}/World/GetStatistics?ipAdress=${playerIp}`, {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + sp
                }
            })
            .then((response) => {
                return response.json();
            })
            .then((data) => {

                $('#stats_games').text(data.totalGames);
                $('#stats_pct').text(`${data.winRate}%`);
                $('#stats_streak').text(data.winSequency);
                $('#stats_maxstreak').text(data.bestSequency);

                DefinePercentageStats(data);

                var sareText = DefineShareText(data.shareText);

                $('#stats_share').val(sareText);

                DefineTimer();
                setInterval(DefineTimer, 1000);
            })
            .catch((err) => {
                console.error(err);
            });
    }

    function DefinePercentageStats(data) {
        $('#histo_1').text(data.quantityWinOneChance);
        $('#histo_2').text(data.quantityWinTwoChance);
        $('#histo_3').text(data.quantityWinThreeChance);
        $('#histo_4').text(data.quantityWinFourChance);
        $('#histo_5').text(data.quantityWinFiveChance);
        $('#histo_6').text(data.quantityWinSixChance);
        $('#histo_loses').text(data.quantityLoses);

        var arrayNumbers = [data.quantityWinOneChance, data.quantityWinTwoChance, data.quantityWinThreeChance, data.quantityWinFourChance, data.quantityWinFiveChance, data.quantityWinSixChance, data.quantityLoses];
        var maiorNumero = Math.max(...arrayNumbers);

        if ($('#histo_1').text() != 0) {

            var percent = (data.quantityWinOneChance * 100) / maiorNumero;
            var styleStr = `width:${percent}%`;

            var element = document.getElementById('histo_1');
            element.className = 'stats_histo';
            element.style = styleStr;
        }

        if ($('#histo_2').text() != 0) {

            var percent = (data.quantityWinTwoChance * 100) / maiorNumero;
            var styleStr = `width:${percent}%`;

            var element = document.getElementById('histo_2');
            element.className = 'stats_histo';
            element.style = styleStr;
        }

        if ($('#histo_3').text() != 0) {

            var percent = (data.quantityWinThreeChance * 100) / maiorNumero;
            var styleStr = `width:${percent}%`;

            var element = document.getElementById('histo_3');
            element.className = 'stats_histo';
            element.style = styleStr;
        }

        if ($('#histo_4').text() != 0) {

            var percent = (data.quantityWinFourChance * 100) / maiorNumero;
            var styleStr = `width:${percent}%`;

            var element = document.getElementById('histo_4');
            element.className = 'stats_histo';
            element.style = styleStr;
        }

        if ($('#histo_5').text() != 0) {

            var percent = (data.quantityWinFiveChance * 100) / maiorNumero;
            var styleStr = `width:${percent}%`;

            var element = document.getElementById('histo_5');
            element.className = 'stats_histo';
            element.style = styleStr;
        }

        if ($('#histo_6').text() != 0) {

            var percent = (data.quantityWinSixChance * 100) / maiorNumero;
            var styleStr = `width:${percent}%`;

            var element = document.getElementById('histo_6');
            element.className = 'stats_histo';
            element.style = styleStr;
        }

        if ($('#histo_loses').text() != 0) {

            var percent = (data.quantityLoses * 100) / maiorNumero;
            var styleStr = `width:${percent}%`;

            var element = document.getElementById('histo_loses');
            element.className = 'stats_histo';
            element.style = styleStr;
        }
    }

    function DefineTimer() {

        var toDate = new Date();
        var tomorrow = new Date();

        tomorrow.setHours(24, 0, 0, 0);

        var diffMS = tomorrow.getTime() / 1000 - toDate.getTime() / 1000;
        var diffHr = Math.floor(diffMS / 3600);
        diffMS = diffMS - diffHr * 3600;
        var diffMi = Math.floor(diffMS / 60);
        diffMS = diffMS - diffMi * 60;
        var diffS = Math.floor(diffMS);
        var result = ((diffHr < 10) ? "0" + diffHr : diffHr);
        result += ":" + ((diffMi < 10) ? "0" + diffMi : diffMi);
        result += ":" + ((diffS < 10) ? "0" + diffS : diffS);

        $('#stats_time').text(result);
    }

    function DefineShareText(text) {
        return text.replaceAll("P", "⬛").replaceAll("A", "🟨").replaceAll("V", "🟩");
    }
    // #endregion

    // #region Modais

    document.onclick = function CloseModals(event) {

        if (event.target.id == 'stats_share') {
            navigator.clipboard.writeText($('#stats_share').val());
            Notify("copiado para o ctrl+V", 1000);
            return;
        }

        var elementDivConfig = document.getElementById('config');
        if (event.composedPath().includes(elementDivConfig)) {
            return;
        }

        if ($("#help").is(':visible') || $("#config").is(':visible') || $("#stats").is(':visible')) {
            $("#help").hide();
            $("#stats").hide();
            $("#config").hide();
            return;
        }

        if (ganhou && !$("#stats").is(':visible') && event.target.id != 'how' && event.target.id != 'config_img') {
            $("#help").hide();
            $("#config").hide();
            $("#stats").show();
            return;
        }

        $("#help").hide();
        $("#stats").hide();
        $("#config").hide();
    }

    $("#config_contrast").change(function() {
        if (this.checked) {
            document.body.className = 'high';
        } else {
            document.body.className = '';
        }
    });

    $(document).ready(function() {
        $("#how").click(function() {
            setTimeout(() => $("#help").show(), 50);
        });
    });

    $(document).ready(function() {
        $("#config_button").click(function() {
            setTimeout(() => $("#config").show(), 50);
        });
    });

    $(document).ready(function() {
        $("#prestats_button").click(function() {
            setTimeout(() => {
                $("#stats").show();
                GetPlayerStats(false);
            }, 50);
        });
    });
    // #endregion

    function PreencheEspacos(putLetters, key, listLetras, animation) {

        const index = parseInt(key);
        var id = `${colunaAtual}-${index}`;
        const letterElement = document.getElementById(id);
        letterElement.className = animation;
        if (putLetters) {
            letterElement.innerHTML = listLetras[key];
        }
    }

    function MudaTelcadoVirtual() {

        for (var key in blackLettersToBoard) {
            var letra = blackLettersToBoard[key];
            var id = `board-${letra}`;
            const letterElement = document.getElementById(id);

            if (!letterElement) {
                return
            }

            letterElement.className = 'wrong';
        }

        for (var key in yellowLettersToBoard) {
            var letra = yellowLettersToBoard[key];
            var id = `board-${letra}`;
            const letterElement = document.getElementById(id);

            if (!letterElement) {
                return
            }

            letterElement.className = 'place';
        }

        for (var key in greenLettersToBoard) {
            var letra = greenLettersToBoard[key];
            var id = `board-${letra}`;
            const letterElement = document.getElementById(id);

            if (!letterElement) {
                return
            }

            letterElement.className = 'right';
        }
    }

    function Notify(msg, time) {
        var msgElement = document.getElementById("msg");
        msgElement.innerHTML = msg;
        msgElement.focus();
        msgElement.setAttribute("open", "true");
        Animation(msgElement, "0.25s linear popup forwards");
        if (time != -1) {
            setTimeout(() => {
                msgElement.style.animation = 'none';
            }, parseInt(time));
        }
    }

    function Animation(element, style) {
        element.style.animation = null;
        element.getClientRects();
        element.style.animation = style;
    }

    function getActualRow() {
        return document.querySelector("#board .row:nth-child(".concat(colunaAtual, ")"));
    }

    function ErrouPalavra() {
        var row = getActualRow();
        Animation(row, "0.75s ease-in-out rownope");
    }

    function ShowPage() {
        document.getElementById("loader").style.display = "none";
        document.getElementById("allPage").style.display = "block";
    }
});