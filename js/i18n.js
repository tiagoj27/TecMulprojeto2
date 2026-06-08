var IdiomasJogo = (function() {
    var storageKey = 'agrogtIdioma';
    var ordem = ['pt', 'en', 'es', 'fr'];
    var nomes = { pt: 'PT', en: 'EN', es: 'ES', fr: 'FR' };

    var textos = {
        pt: {
            subtitulo: 'GAME EDITION',
            iniciar: 'INICIAR JOGO',
            creditos: 'Desenvolvido para Tecnologias de Multimédia',
            pausaTitulo: 'JOGO PAUSADO',
            pausaHint: 'Pressiona ESC para voltar',
            continuar: 'CONTINUAR',
            idioma: 'IDIOMA',
            proximoCiclo: 'Próximo ciclo',
            tituloPagina: 'Quinta Isométrica - Turbo Edition',
            campo: 'Campo',
            loja: 'Loja',
            stand: 'Stand',
            pomar: 'Pomar',
            animais: 'Animais',
            sair: 'SAIR',
            voltarCampo: 'De volta ao campo!',
            entrarStand: 'A entrar no stand...',
            irPomar: 'A ir para o pomar...',
            irAnimais: 'A ir para os animais...',
            controles: 'CONTROLOS',
            moverTrator: 'Mover trator',
            semearColherArar: 'Semear / Colher / arar',
            semente: 'Semente',
            arado: 'Arado',
            moverAspersor: 'Mover aspersor',
            adubo: 'Adubo',
            expandir: 'Expandir',
            diaSeguinte: 'Dia seguinte',
            dia: 'Dia',
            nivelQuinta: 'Quinta nv.',
            plantar: 'plantar',
            vazio: 'Vazio',
            broto: 'Broto',
            crescendo: 'A crescer',
            maduro: 'Maduro',
            colher: 'Colher!',
            missoes: 'MISSÕES',
            contrato: 'CONTRATO',
            concluido: 'Concluído!',
            progresso: 'Progresso',
            conquistas: 'Conquistas',
            saldo: 'Saldo',
            comprar: 'comprar',
            reset: 'Reset',
            standTitulo: 'STAND DA QUINTA',
            standSubtitulo: 'a garagem dos campeões',
            meuTrator: 'O MEU TRATOR',
            upgradesDisponiveis: 'UPGRADES DISPONÍVEIS',
            estatisticas: 'ESTATÍSTICAS',
            lojaAjudaScroll: 'Roda do rato para ver mais · [1-9] comprar',
            lojaAjudaCompra: '[1-9] comprar · [ESC]/[V]/◀ SAIR',
            standToast: 'Stand — gasta € em upgrades! [1-9] ou clica',
            trator: 'Trator',
            gasto: 'Gasto',
            colheitas: 'Colheitas',
            exp: 'Exp.',
            silos: 'Silos',
            celeiro: 'Celeiro',
            ouro: 'Ouro',
            exportador: 'Export.',
            sim: 'Sim',
            nao: 'Não',
            terrenoMais: 'Terreno+',
            pomarHint: '[ESPAÇO] plantar/colher · [ESC] campo',
            animaisHint: '[ESPAÇO] alimentar · [R] recolher',
            lojaAnimais: 'LOJA DOS ANIMAIS',
            lojaAnimaisInfo: 'Clique para comprar. A produção só acontece se alimentares.',
            comprarGalinha: '+1 Galinha — 250€',
            comprarVaca: '+1 Vaca — 650€',
            sairLojaAnimais: 'Sai da loja ao mover para fora da tile',
            galinhas: 'Galinhas',
            vacas: 'Vacas',
            alimentadas: 'Alimentadas',
            ovosProntos: 'Ovos prontos',
            leitePronto: 'Leite pronto'
        },
        en: {
            subtitulo: 'GAME EDITION',
            iniciar: 'START GAME',
            creditos: 'Developed for Multimedia Technologies',
            pausaTitulo: 'GAME PAUSED',
            pausaHint: 'Press ESC to return',
            continuar: 'CONTINUE',
            idioma: 'LANGUAGE',
            proximoCiclo: 'Next cycle',
            tituloPagina: 'Isometric Farm - Turbo Edition',
            campo: 'Field',
            loja: 'Shop',
            stand: 'Shop',
            pomar: 'Orchard',
            animais: 'Animals',
            sair: 'EXIT',
            voltarCampo: 'Back to the field!',
            entrarStand: 'Entering the shop...',
            irPomar: 'Going to the orchard...',
            irAnimais: 'Going to the animals...',
            controles: 'CONTROLS',
            moverTrator: 'Move tractor',
            semearColherArar: 'Plant / Harvest / plow',
            semente: 'Seed',
            arado: 'Plow',
            moverAspersor: 'Move sprinkler',
            adubo: 'Fertilizer',
            expandir: 'Expand',
            diaSeguinte: 'Next day',
            dia: 'Day',
            nivelQuinta: 'Farm lvl.',
            plantar: 'plant',
            vazio: 'Empty',
            broto: 'Sprout',
            crescendo: 'Growing',
            maduro: 'Mature',
            colher: 'Harvest!',
            missoes: 'MISSIONS',
            contrato: 'CONTRACT',
            concluido: 'Completed!',
            progresso: 'Progress',
            conquistas: 'Achievements',
            saldo: 'Balance',
            comprar: 'buy',
            reset: 'Reset',
            standTitulo: 'FARM SHOP',
            standSubtitulo: 'the champions garage',
            meuTrator: 'MY TRACTOR',
            upgradesDisponiveis: 'AVAILABLE UPGRADES',
            estatisticas: 'STATISTICS',
            lojaAjudaScroll: 'Mouse wheel to see more · [1-9] buy',
            lojaAjudaCompra: '[1-9] buy · [ESC]/[V]/◀ EXIT',
            standToast: 'Shop — spend € on upgrades! [1-9] or click',
            trator: 'Tractor',
            gasto: 'Spent',
            colheitas: 'Harvests',
            exp: 'Exp.',
            silos: 'Silos',
            celeiro: 'Barn',
            ouro: 'Gold',
            exportador: 'Exporter',
            sim: 'Yes',
            nao: 'No',
            terrenoMais: 'Land+',
            pomarHint: '[SPACE] plant/harvest · [ESC] field',
            animaisHint: '[SPACE] feed · [R] collect',
            lojaAnimais: 'ANIMAL SHOP',
            lojaAnimaisInfo: 'Click to buy. Production only happens after feeding.',
            comprarGalinha: '+1 Chicken — 250€',
            comprarVaca: '+1 Cow — 650€',
            sairLojaAnimais: 'Leave the shop by moving away from the tile',
            galinhas: 'Chickens',
            vacas: 'Cows',
            alimentadas: 'Fed',
            ovosProntos: 'Eggs ready',
            leitePronto: 'Milk ready'
        },
        es: {
            subtitulo: 'GAME EDITION',
            iniciar: 'INICIAR JUEGO',
            creditos: 'Desarrollado para Tecnologías Multimedia',
            pausaTitulo: 'JUEGO PAUSADO',
            pausaHint: 'Pulsa ESC para volver',
            continuar: 'CONTINUAR',
            idioma: 'IDIOMA',
            proximoCiclo: 'Próximo ciclo',
            tituloPagina: 'Granja Isométrica - Turbo Edition',
            campo: 'Campo',
            loja: 'Tienda',
            stand: 'Tienda',
            pomar: 'Huerto',
            animais: 'Animales',
            sair: 'SALIR',
            voltarCampo: '¡De vuelta al campo!',
            entrarStand: 'Entrando en la tienda...',
            irPomar: 'Yendo al huerto...',
            irAnimais: 'Yendo a los animales...',
            controles: 'CONTROLES',
            moverTrator: 'Mover tractor',
            semearColherArar: 'Plantar / Cosechar / arar',
            semente: 'Semilla',
            arado: 'Arado',
            moverAspersor: 'Mover aspersor',
            adubo: 'Fertilizante',
            expandir: 'Expandir',
            diaSeguinte: 'Día siguiente',
            dia: 'Día',
            nivelQuinta: 'Granja nv.',
            plantar: 'plantar',
            vazio: 'Vacío',
            broto: 'Brote',
            crescendo: 'Creciendo',
            maduro: 'Maduro',
            colher: '¡Cosechar!',
            missoes: 'MISIONES',
            contrato: 'CONTRATO',
            concluido: '¡Completado!',
            progresso: 'Progreso',
            conquistas: 'Logros',
            saldo: 'Saldo',
            comprar: 'comprar',
            reset: 'Reset',
            standTitulo: 'TIENDA DE LA GRANJA',
            standSubtitulo: 'el garaje de los campeones',
            meuTrator: 'MI TRACTOR',
            upgradesDisponiveis: 'MEJORAS DISPONIBLES',
            estatisticas: 'ESTADÍSTICAS',
            lojaAjudaScroll: 'Rueda del ratón para ver más · [1-9] comprar',
            lojaAjudaCompra: '[1-9] comprar · [ESC]/[V]/◀ SALIR',
            standToast: 'Tienda — gasta € en mejoras! [1-9] o clic',
            trator: 'Tractor',
            gasto: 'Gastado',
            colheitas: 'Cosechas',
            exp: 'Exp.',
            silos: 'Silos',
            celeiro: 'Granero',
            ouro: 'Oro',
            exportador: 'Export.',
            sim: 'Sí',
            nao: 'No',
            terrenoMais: 'Terreno+',
            pomarHint: '[ESPACIO] plantar/cosechar · [ESC] campo',
            animaisHint: '[ESPACIO] alimentar · [R] recoger',
            lojaAnimais: 'TIENDA DE ANIMALES',
            lojaAnimaisInfo: 'Haz clic para comprar. La producción solo ocurre si alimentas.',
            comprarGalinha: '+1 Gallina — 250€',
            comprarVaca: '+1 Vaca — 650€',
            sairLojaAnimais: 'Sal de la tienda moviéndote fuera de la casilla',
            galinhas: 'Gallinas',
            vacas: 'Vacas',
            alimentadas: 'Alimentadas',
            ovosProntos: 'Huevos listos',
            leitePronto: 'Leche lista'
        },
        fr: {
            subtitulo: 'GAME EDITION',
            iniciar: 'LANCER LE JEU',
            creditos: 'Développé pour les Technologies Multimédia',
            pausaTitulo: 'JEU EN PAUSE',
            pausaHint: 'Appuie sur Échap pour revenir',
            continuar: 'CONTINUER',
            idioma: 'LANGUE',
            proximoCiclo: 'Cycle suivant',
            tituloPagina: 'Ferme Isométrique - Turbo Edition',
            campo: 'Champ',
            loja: 'Boutique',
            stand: 'Boutique',
            pomar: 'Verger',
            animais: 'Animaux',
            sair: 'SORTIR',
            voltarCampo: 'Retour au champ !',
            entrarStand: 'Entrée dans la boutique...',
            irPomar: 'Direction le verger...',
            irAnimais: 'Direction les animaux...',
            controles: 'CONTRÔLES',
            moverTrator: 'Déplacer le tracteur',
            semearColherArar: 'Planter / Récolter / labourer',
            semente: 'Graine',
            arado: 'Charrue',
            moverAspersor: 'Déplacer arroseur',
            adubo: 'Engrais',
            expandir: 'Agrandir',
            diaSeguinte: 'Jour suivant',
            dia: 'Jour',
            nivelQuinta: 'Ferme niv.',
            plantar: 'planter',
            vazio: 'Vide',
            broto: 'Pousse',
            crescendo: 'En croissance',
            maduro: 'Mûr',
            colher: 'Récolter !',
            missoes: 'MISSIONS',
            contrato: 'CONTRAT',
            concluido: 'Terminé !',
            progresso: 'Progrès',
            conquistas: 'Succès',
            saldo: 'Solde',
            comprar: 'acheter',
            reset: 'Reset',
            standTitulo: 'BOUTIQUE DE LA FERME',
            standSubtitulo: 'le garage des champions',
            meuTrator: 'MON TRACTEUR',
            upgradesDisponiveis: 'AMÉLIORATIONS DISPONIBLES',
            estatisticas: 'STATISTIQUES',
            lojaAjudaScroll: 'Molette pour voir plus · [1-9] acheter',
            lojaAjudaCompra: '[1-9] acheter · [ESC]/[V]/◀ SORTIR',
            standToast: 'Boutique — dépense des € en améliorations ! [1-9] ou clic',
            trator: 'Tracteur',
            gasto: 'Dépensé',
            colheitas: 'Récoltes',
            exp: 'Exp.',
            silos: 'Silos',
            celeiro: 'Grange',
            ouro: 'Or',
            exportador: 'Export.',
            sim: 'Oui',
            nao: 'Non',
            terrenoMais: 'Terrain+',
            pomarHint: '[ESPACE] planter/récolter · [ESC] champ',
            animaisHint: '[ESPACE] nourrir · [R] ramasser',
            lojaAnimais: 'BOUTIQUE DES ANIMAUX',
            lojaAnimaisInfo: 'Clique pour acheter. La production demande de nourrir.',
            comprarGalinha: '+1 Poule — 250€',
            comprarVaca: '+1 Vache — 650€',
            sairLojaAnimais: 'Sors de la boutique en quittant la case',
            galinhas: 'Poules',
            vacas: 'Vaches',
            alimentadas: 'Nourries',
            ovosProntos: 'Oeufs prêts',
            leitePronto: 'Lait prêt'
        }
    };

    var lojaItens = {
        en: {
            trator2: { nome: 'Turbo Tractor', desc: 'Faster, still controllable' },
            ouro: { nome: 'Golden Harvest', desc: '+35% crop value' },
            arado: { nome: 'Plow', desc: 'Attach with [C] and plow by holding space' },
            terreno: { nome: 'Expand land', desc: 'Unlocks 6 nearby plots' },
            aspersor: { nome: 'Sprinkler', desc: 'Waters 3x3; move with [M]' },
            silo: { nome: 'Silo', desc: '+200€/day income' },
            galinheiro: { nome: 'Chicken coop', desc: '+180€/day, feed costs 90€/day' },
            empregado: { nome: 'Worker', desc: 'Harvests 1 plant per cycle' },
            estufa: { nome: 'Greenhouse', desc: 'Unlocks lavender' },
            ouro2: { nome: 'Golden Harvest II', desc: '+25% extra on harvests' },
            irradiador: { nome: 'Irradiator', desc: 'Cycles are 12% faster' },
            trator3: { nome: 'Hyper Tractor', desc: 'Even faster without losing control' },
            celeiro: { nome: 'Barn', desc: '+500€/day income' },
            exportador: { nome: 'Exporter', desc: '+20% on all sales' },
            elite: { nome: 'Elite Seeds', desc: '+30% profit for the current crop' },
            pomar: { nome: 'Orchard', desc: 'Unlocks trees and large crops' }
        },
        es: {
            trator2: { nome: 'Tractor Turbo', desc: 'Más rápido, pero controlable' },
            ouro: { nome: 'Cosecha de Oro', desc: '+35% valor de cosechas' },
            arado: { nome: 'Arado', desc: 'Acopla con [C] y ara manteniendo espacio' },
            terreno: { nome: 'Expandir terreno', desc: 'Desbloquea 6 parcelas cercanas' },
            aspersor: { nome: 'Aspersor', desc: 'Riega 3x3; mover con [M]' },
            silo: { nome: 'Silo', desc: '+200€/día de ingresos' },
            galinheiro: { nome: 'Gallinero', desc: '+180€/día, pienso 90€/día' },
            empregado: { nome: 'Empleado', desc: 'Cosecha 1 planta por ciclo' },
            estufa: { nome: 'Invernadero', desc: 'Desbloquea lavanda' },
            ouro2: { nome: 'Cosecha de Oro II', desc: '+25% extra en cosechas' },
            irradiador: { nome: 'Irradiador', desc: 'Ciclos 12% más rápidos' },
            trator3: { nome: 'Tractor Hiper', desc: 'Aún más rápido sin perder control' },
            celeiro: { nome: 'Granero', desc: '+500€/día de ingresos' },
            exportador: { nome: 'Exportador', desc: '+20% en todas las ventas' },
            elite: { nome: 'Semillas Elite', desc: '+30% beneficio del cultivo actual' },
            pomar: { nome: 'Huerto', desc: 'Desbloquea árboles y cultivos grandes' }
        },
        fr: {
            trator2: { nome: 'Tracteur Turbo', desc: 'Plus rapide, mais contrôlable' },
            ouro: { nome: 'Récolte d’Or', desc: '+35% valeur des récoltes' },
            arado: { nome: 'Charrue', desc: 'Attache avec [C] et laboure en tenant espace' },
            terreno: { nome: 'Agrandir terrain', desc: 'Débloque 6 parcelles proches' },
            aspersor: { nome: 'Arroseur', desc: 'Arrose 3x3; déplacer avec [M]' },
            silo: { nome: 'Silo', desc: '+200€/jour de revenu' },
            galinheiro: { nome: 'Poulailler', desc: '+180€/jour, nourriture 90€/jour' },
            empregado: { nome: 'Employé', desc: 'Récolte 1 plante par cycle' },
            estufa: { nome: 'Serre', desc: 'Débloque la lavande' },
            ouro2: { nome: 'Récolte d’Or II', desc: '+25% extra sur les récoltes' },
            irradiador: { nome: 'Irradiateur', desc: 'Cycles 12% plus rapides' },
            trator3: { nome: 'Tracteur Hyper', desc: 'Encore plus rapide sans perdre le contrôle' },
            celeiro: { nome: 'Grange', desc: '+500€/jour de revenu' },
            exportador: { nome: 'Exportateur', desc: '+20% sur toutes les ventes' },
            elite: { nome: 'Graines Elite', desc: '+30% profit sur la culture actuelle' },
            pomar: { nome: 'Verger', desc: 'Débloque arbres et grandes cultures' }
        }
    };

    var mensagens = {
        en: {
            precisaEstufa: 'You need the Greenhouse from the shop!',
            precisaPomar: 'You need to unlock the Orchard in the shop!',
            culturaSoPomar: 'This crop can only be planted in the Orchard',
            precisasValor: 'You need {valor}€',
            sementesCustam: 'Seeds cost {valor}€',
            semAgua: 'No water! Use [N] to pass the day',
            nadaRegar: 'Nothing to water',
            jaRegado: 'Already watered!',
            regadoOk: 'Watered! Grows faster.',
            aquiNaoExpande: 'You cannot expand here',
            jaDesbloqueado: 'Already unlocked',
            expandido: 'Expanded! (-{valor}€)',
            sementeAtual: 'Seed: {nome} ({valor}€)',
            diaResumo: 'Day {dia} — {evento}',
            impostos: 'Taxes: -{valor}€',
            racao: 'Feed: -{valor}€',
            rendimento: 'Income: +{valor}€',
            saldoInsuficiente: 'Not enough balance',
            compraFeita: 'Purchase complete!',
            animaisIndisp: 'Animals are not available yet',
            semGalinhas: 'You have no chickens',
            galinhasTodas: 'All chickens are already fed',
            semVacas: 'You have no cows',
            vacasTodas: 'All cows are already fed',
            semOvos: 'No eggs ready',
            semLeite: 'No milk ready',
            semAnimaisAqui: 'No animals here',
            pomarBloq: 'Orchard is not unlocked yet',
            pomarSoArvores: 'Only trees/large crops can be planted in the Orchard',
            espacoArvores: 'You need 1 empty block between trees',
            colheste: 'Harvested +{valor}€'
            , jaMaximo: 'Already at maximum!'
            , requisitoFalta: 'Missing requirement'
            , itemComprado: '{nome} purchased! (-{valor}€)'
        },
        es: {
            precisaEstufa: '¡Necesitas el Invernadero de la tienda!',
            precisaPomar: '¡Necesitas desbloquear el Huerto en la tienda!',
            culturaSoPomar: 'Este cultivo solo se puede plantar en el Huerto',
            precisasValor: 'Necesitas {valor}€',
            sementesCustam: 'Las semillas cuestan {valor}€',
            semAgua: '¡Sin agua! Usa [N] para pasar el día',
            nadaRegar: 'Nada para regar',
            jaRegado: '¡Ya está regado!',
            regadoOk: '¡Regado! Crece más rápido.',
            aquiNaoExpande: 'Aquí no se puede expandir',
            jaDesbloqueado: 'Ya desbloqueado',
            expandido: '¡Expandido! (-{valor}€)',
            sementeAtual: 'Semilla: {nome} ({valor}€)',
            diaResumo: 'Día {dia} — {evento}',
            impostos: 'Impuestos: -{valor}€',
            racao: 'Pienso: -{valor}€',
            rendimento: 'Ingresos: +{valor}€',
            saldoInsuficiente: 'Saldo insuficiente',
            compraFeita: '¡Compra hecha!',
            animaisIndisp: 'Los animales aún no están disponibles',
            semGalinhas: 'No tienes gallinas',
            galinhasTodas: 'Todas las gallinas ya están alimentadas',
            semVacas: 'No tienes vacas',
            vacasTodas: 'Todas las vacas ya están alimentadas',
            semOvos: 'No hay huevos listos',
            semLeite: 'No hay leche lista',
            semAnimaisAqui: 'Aquí no hay animales',
            pomarBloq: 'El Huerto aún no está desbloqueado',
            pomarSoArvores: 'En el Huerto solo puedes plantar árboles/cultivos grandes',
            espacoArvores: 'Necesitas 1 bloque libre entre árboles',
            colheste: 'Cosechaste +{valor}€'
            , jaMaximo: '¡Ya está al máximo!'
            , requisitoFalta: 'Falta un requisito'
            , itemComprado: '¡{nome} comprado! (-{valor}€)'
        },
        fr: {
            precisaEstufa: 'Il faut la Serre de la boutique !',
            precisaPomar: 'Il faut débloquer le Verger dans la boutique !',
            culturaSoPomar: 'Cette culture se plante seulement dans le Verger',
            precisasValor: 'Il te faut {valor}€',
            sementesCustam: 'Les graines coûtent {valor}€',
            semAgua: 'Plus d’eau ! Utilise [N] pour passer le jour',
            nadaRegar: 'Rien à arroser',
            jaRegado: 'Déjà arrosé !',
            regadoOk: 'Arrosé ! Pousse plus vite.',
            aquiNaoExpande: 'Impossible d’agrandir ici',
            jaDesbloqueado: 'Déjà débloqué',
            expandido: 'Agrandissement ! (-{valor}€)',
            sementeAtual: 'Graine : {nome} ({valor}€)',
            diaResumo: 'Jour {dia} — {evento}',
            impostos: 'Taxes : -{valor}€',
            racao: 'Nourriture : -{valor}€',
            rendimento: 'Revenu : +{valor}€',
            saldoInsuficiente: 'Solde insuffisant',
            compraFeita: 'Achat effectué !',
            animaisIndisp: 'Les animaux ne sont pas encore disponibles',
            semGalinhas: 'Tu n’as pas de poules',
            galinhasTodas: 'Toutes les poules sont déjà nourries',
            semVacas: 'Tu n’as pas de vaches',
            vacasTodas: 'Toutes les vaches sont déjà nourries',
            semOvos: 'Aucun oeuf prêt',
            semLeite: 'Aucun lait prêt',
            semAnimaisAqui: 'Aucun animal ici',
            pomarBloq: 'Le Verger n’est pas encore débloqué',
            pomarSoArvores: 'Dans le Verger, seules les grandes cultures/arbres sont possibles',
            espacoArvores: 'Il faut 1 case vide entre les arbres',
            colheste: 'Récolté +{valor}€'
            , jaMaximo: 'Déjà au maximum !'
            , requisitoFalta: 'Condition manquante'
            , itemComprado: '{nome} acheté ! (-{valor}€)'
        }
    };

    var atual = carregar();

    function carregar() {
        try {
            var guardado = localStorage.getItem(storageKey);
            if (ordem.indexOf(guardado) >= 0) return guardado;
        } catch (e) {}
        return 'pt';
    }

    function guardar(lang) {
        atual = lang;
        try { localStorage.setItem(storageKey, lang); } catch (e) {}
        if (typeof document !== 'undefined' && document.documentElement) document.documentElement.lang = lang;
        atualizarDom();
    }

    function t(chave) {
        var pack = textos[atual] || textos.pt;
        return pack[chave] || textos.pt[chave] || chave;
    }

    function f(chave, vars) {
        var out = t(chave);
        vars = vars || {};
        Object.keys(vars).forEach(function(k) {
            out = out.replace(new RegExp('\\{' + k + '\\}', 'g'), vars[k]);
        });
        return out;
    }

    function itemLoja(id, campo, fallback) {
        var pack = lojaItens[atual] || {};
        return (pack[id] && pack[id][campo]) || fallback;
    }

    function msg(chave, fallback, vars) {
        var pack = mensagens[atual] || {};
        var out = pack[chave] || fallback || chave;
        vars = vars || {};
        Object.keys(vars).forEach(function(k) {
            out = out.replace(new RegExp('\\{' + k + '\\}', 'g'), vars[k]);
        });
        return out;
    }

    function missaoDesc(m) {
        if (!m) return '';
        var alvo = m.alvo || 0;
        var pack = {
            pt: {
                colheitas: 'Colher ' + alvo + ' plantas',
                expandir: 'Expandir ' + alvo + ' parcelas',
                riqueza: 'Acumular ' + alvo + '€',
                gastar: 'Gastar ' + alvo + '€ na loja'
            },
            en: {
                colheitas: 'Harvest ' + alvo + ' plants',
                expandir: 'Expand ' + alvo + ' plots',
                riqueza: 'Save ' + alvo + '€',
                gastar: 'Spend ' + alvo + '€ in the shop'
            },
            es: {
                colheitas: 'Cosechar ' + alvo + ' plantas',
                expandir: 'Expandir ' + alvo + ' parcelas',
                riqueza: 'Acumular ' + alvo + '€',
                gastar: 'Gastar ' + alvo + '€ en la tienda'
            },
            fr: {
                colheitas: 'Récolter ' + alvo + ' plantes',
                expandir: 'Agrandir ' + alvo + ' parcelles',
                riqueza: 'Accumuler ' + alvo + '€',
                gastar: 'Dépenser ' + alvo + '€ à la boutique'
            }
        };
        return (pack[atual] && pack[atual][m.id]) || m.desc || '';
    }

    function contratoDesc(c) {
        if (!c) return '';
        var alvo = c.alvo || 0;
        if (c.tipo === 'colheitas') {
            return {
                pt: 'Colher ' + alvo + ' plantas',
                en: 'Harvest ' + alvo + ' plants',
                es: 'Cosechar ' + alvo + ' plantas',
                fr: 'Récolter ' + alvo + ' plantes'
            }[atual] || c.desc;
        }
        if (c.tipo === 'cultura') {
            var nome = (typeof CULTURAS !== 'undefined' && CULTURAS[c.cultura]) ? CULTURAS[c.cultura].nome : (c.cultura || '');
            return {
                pt: 'Colher ' + alvo + 'x ' + nome,
                en: 'Harvest ' + alvo + 'x ' + nome,
                es: 'Cosechar ' + alvo + 'x ' + nome,
                fr: 'Récolter ' + alvo + 'x ' + nome
            }[atual] || c.desc;
        }
        if (c.tipo === 'expandir') {
            return {
                pt: 'Expandir ' + alvo + ' parcelas',
                en: 'Expand ' + alvo + ' plots',
                es: 'Expandir ' + alvo + ' parcelas',
                fr: 'Agrandir ' + alvo + ' parcelles'
            }[atual] || c.desc;
        }
        return c.desc || '';
    }

    function alternar() {
        var idx = ordem.indexOf(atual);
        guardar(ordem[(idx + 1) % ordem.length]);
        return atual;
    }

    function rotuloIdioma() {
        return t('idioma') + ': ' + nomes[atual];
    }

    function atualizarDom() {
        if (typeof document === 'undefined') return;
        document.title = t('tituloPagina');
        var grow = document.querySelector('#growbar span');
        if (grow) grow.textContent = '🌱 ' + t('proximoCiclo');
    }

    function criarBotao(scene, x, y, onChange) {
        var largura = 150;
        var altura = 38;
        var bg = scene.add.graphics().setDepth(100000);
        var txt = scene.add.text(x, y, rotuloIdioma(), {
            fontSize: '13px',
            fill: '#e2e8f0',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontStyle: 'bold',
            align: 'center'
        }).setOrigin(0.5).setDepth(100001);

        function desenhar(cor, linha) {
            bg.clear();
            bg.fillStyle(cor, 0.92);
            bg.fillRoundedRect(x - largura / 2, y - altura / 2, largura, altura, 8);
            bg.lineStyle(1, linha, 0.85);
            bg.strokeRoundedRect(x - largura / 2, y - altura / 2, largura, altura, 8);
        }

        desenhar(0x0b1220, 0x38bdf8);
        var zona = scene.add.zone(x, y, largura, altura)
            .setOrigin(0.5)
            .setDepth(100002)
            .setInteractive({ useHandCursor: true });

        zona.on('pointerover', function() {
            desenhar(0x123047, 0xfacc15);
            txt.setScale(1.04);
        });
        zona.on('pointerout', function() {
            desenhar(0x0b1220, 0x38bdf8);
            txt.setScale(1);
        });
        zona.on('pointerdown', function() {
            alternar();
            txt.setText(rotuloIdioma());
            if (window.AudioJogo) AudioJogo.sfx('click');
            if (onChange) onChange();
        });

        return {
            setText: function() { txt.setText(rotuloIdioma()); },
            bg: bg,
            txt: txt,
            zone: zona
        };
    }

    guardar(atual);

    return {
        t: t,
        f: f,
        itemLoja: itemLoja,
        msg: msg,
        missaoDesc: missaoDesc,
        contratoDesc: contratoDesc,
        atual: function() { return atual; },
        alternar: alternar,
        rotuloIdioma: rotuloIdioma,
        criarBotao: criarBotao,
        atualizarDom: atualizarDom
    };
})();
