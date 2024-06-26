document.getElementById('seatCheckerForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const term = document.getElementById('term').value;
    const classNbr = document.getElementById('classNbr').value;
    const email = document.getElementById('email').value;

    fetch(`/checkSeats?term=${term}&classNbr=${classNbr}&email=${email}`)
        .then(response => response.json())
        .then(data => {
            const resultDiv = document.getElementById('result');
            if (data.success) {
                if (data.seats > 0) {
                    resultDiv.innerHTML = `Class: ${data.className}, Available Seats: ${data.seats}`;
                } else {
                    resultDiv.innerHTML = `Class: ${data.className}, Available Seats: 0. Right now there are no seats available. You will be notified via email as soon as a seat becomes available.`;
                }
            } else {
                resultDiv.innerHTML = `Error: ${data.message}`;
            }
        })
        .catch(error => {
            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = `Error: ${error.message}`;
        });
});
