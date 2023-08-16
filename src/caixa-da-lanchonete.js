import Decimal from "decimal.js";

class CaixaDaLanchonete {

    cardapio = [
        ['cafe', 'Café', 3.00],
        ['chantily', 'Chantily', 1.50],
        ['suco','Suco Natural', 6.20],
        ['sanduiche','Sanduíche', 6.50],
        ['queijo','Queijo', 2.00],
        ['salgado','Salgado', 7.25],
        ['combo1', '1 Suco e 1 Sanduiche', 9.50],
        ['combo2','1 Café e 1 Sanduíche', 7.50]
    ];
    
    formaPagamento = [
        ['dinheiro', -5],
        ['debito', 0],
        ['credito', 3]
    ];
    

    calcularValorDaCompra(metodoDePagamento, itens) {
        
        var total = new Decimal(0);
        var erro = "";

        var temSanduiche = false;
        var temCafe = false;
        var temChantily = false;
        var temQueijo = false;

        //testa carrinho vazio
        if(!itens || itens.length < 1){
            return "Não há itens no carrinho de compra!";
        }

        //testa método de pagamento
        var pagto = this.formaPagamento.find((forma) => forma[0] === metodoDePagamento);
        if (pagto===undefined){
            return "Forma de pagamento inválida!"; 
        }

        //loop nos items recebidos
        itens.forEach(item => {
            var pedido = item.split(',');
            var produto = pedido[0];
            var quantidade = new Decimal(parseFloat(pedido[1]));
            
            //testa quantidade informada
            if(quantidade < 1.0) {
                erro = "Quantidade inválida!";
                return erro;
            }
            
            //obtem linha do cardápio para o produto do item
            var linha = this.cardapio.find((linhaCardapio) => linhaCardapio[0] === produto);
            //testa se item existe no cardápio
            if(linha===undefined) {
                erro = "Item inválido!";
                return erro;
            }

            //guarda informações para validação dos itens extras
            switch (produto) {
                case 'sanduiche': 
                    temSanduiche = true;
                    break;
                case "cafe":
                    temCafe = true;
                    break;
                case "queijo":
                    temQueijo = true;    
                    break;
                case "chantily":
                    temChantily = true;
            }

            var preco = new Decimal(linha[2]);
            var multiplicador = new Decimal(pagto[1]);

            //calcula o valor do item
            var totalItem = preco.times(quantidade).times(1+multiplicador/100);
            //atualiza o total do pedido
            total = total.plus(totalItem);

        });
        if (erro != "") {
            return erro;
        } else {
            //teste de validade dos itens extras
            if((temQueijo && !temSanduiche)||(temChantily && !temCafe)) {
                return "Item extra não pode ser pedido sem o principal";
            }
            //retorna o valor total do pedido formatado para moeda
            return parseFloat(total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }
    }
}

export { CaixaDaLanchonete };
