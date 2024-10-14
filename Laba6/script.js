function loveCalculator() {
    const name1 = prompt("Введіть перше ім'я:");
    const name2 = prompt("Введіть друге ім'я:");
    const loveScore = Math.floor(Math.random() * 100) + 1;
    
    alert(`${name1} і ${name2} мають сумісність ${loveScore}%!`);
}

loveCalculator();