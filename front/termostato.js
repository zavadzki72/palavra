document.addEventListener("DOMContentLoaded", () => {

    const urlApi = 'https://termoapi.azurewebsites.net';
    // const urlApi = 'https://localhost:44363';
    const palmeiras = 'palmeiras_nao_tem_mundial';

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
                GetTermostato();
            })
            .catch((err) => {
                console.error(err);
            });
    }
    // #endregion

    // #region Popula palavras com o que ja temos na API

    function GetTermostato() {
        fetch(`${urlApi}/Termostato/GetTodayTermostato`, {
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

                var formatter = Intl.NumberFormat('pt-BR');

                $('#yesterday_world').text(`#${data.numberWorldLastDay} - ${data.worldLastDay.toLowerCase()}`);
                $('#first_time_general').text(`#${data.percentageFirstTryGeneral}%`);
                $('#wins_general').text(`#${data.percentageWinGeneral}%`);
                $('#games_general').text(formatter.format(parseInt(data.quantityGamesGeneral)));

                DefinePercentageStats(data);

                DefineInvalidWorlds(data);
                DefineFirstWorlds(data);
                DefineAllWorlds(data);

            })
            .then(() => {
                ShowPage();
            })
            .catch((err) => {
                console.error(err);
            });
    }

    function DefinePercentageStats(data) {
        $('#histo_1').text(`${data.percentageWinOneChance}%`);
        $('#histo_2').text(`${data.percentageWinTwoChance}%`);
        $('#histo_3').text(`${data.percentageWinThreeChance}%`);
        $('#histo_4').text(`${data.percentageWinFourChance}%`);
        $('#histo_5').text(`${data.percentageWinFiveChance}%`);
        $('#histo_6').text(`${data.percentageWinSixChance}%`);
        $('#histo_loses').text(`${data.percentageLoses}%`);

        var arrayNumbers = [data.percentageWinOneChance, data.percentageWinTwoChance, data.percentageWinThreeChance, data.percentageWinFourChance, data.percentageWinFiveChance, data.percentageWinSixChance, data.percentageLoses];
        var maiorNumero = Math.max(...arrayNumbers);

        DefinePercentageOfField('#histo_1', data.percentageWinOneChance, maiorNumero);
        DefinePercentageOfField('#histo_2', data.percentageWinTwoChance, maiorNumero);
        DefinePercentageOfField('#histo_3', data.percentageWinThreeChance, maiorNumero);
        DefinePercentageOfField('#histo_4', data.percentageWinFourChance, maiorNumero);
        DefinePercentageOfField('#histo_5', data.percentageWinFiveChance, maiorNumero);
        DefinePercentageOfField('#histo_6', data.percentageWinSixChance, maiorNumero);
        DefinePercentageOfField('#histo_loses', data.percentageLoses, maiorNumero);
    }

    function DefinePercentageOfField(idField, data, maiorNumero) {
        if ($(idField).text() != '0%') {

            var percent = (data * 100) / maiorNumero;
            var styleStr = `width:${percent}%`;

            var element = document.getElementById(idField.replace('#', ''));
            element.className = 'histo_ok';
            element.style = styleStr;
        }
    }

    function DefineInvalidWorlds(data) {

        var html = '<h3>inválidas</h3>';
        var formatter = Intl.NumberFormat('pt-BR');
        var count = 0;

        for (var index in data.invalidWorlds) {
            var stringAtual = `<b>${index.toLowerCase()}</b><i>${formatter.format(data.invalidWorlds[index])}</i>`;
            html += stringAtual;
            count++;
        }

        for (var i = count; i < 10; i++) {
            var stringAtual = `<b>-</b><i>0</i>`;
            html += stringAtual;
        }

        $('#invalid_worlds').append(html);
    }

    function DefineFirstWorlds(data) {

        var html = '<h3>primeira</h3>';
        var formatter = Intl.NumberFormat('pt-BR');
        var count = 0;

        for (var index in data.firstWorlds) {
            var stringAtual = `<b>${index.toLowerCase()}</b><i>${formatter.format(data.firstWorlds[index])}</i>`;
            html += stringAtual;
            count++;
        }

        for (var i = count; i < 10; i++) {
            var stringAtual = `<b>-</b><i>0</i>`;
            html += stringAtual;
        }

        $('#first_worlds').append(html);
    }

    function DefineAllWorlds(data) {

        var html = '<h3>todas</h3>';
        var formatter = Intl.NumberFormat('pt-BR');
        var count = 0;

        for (var index in data.mostTriedWorlds) {
            var stringAtual = `<b>${index.toLowerCase()}</b><i>${formatter.format(data.mostTriedWorlds[index])}</i>`;
            html += stringAtual;
            count++;
        }

        for (var i = count; i < 10; i++) {
            var stringAtual = `<b>-</b><i>0</i>`;
            html += stringAtual;
        }

        $('#all_worlds').append(html);
    }

    // #endregion

    function ShowPage() {
        document.getElementById("loader").style.display = "none";
        document.getElementById("allPage").style.display = "block";
    }
});