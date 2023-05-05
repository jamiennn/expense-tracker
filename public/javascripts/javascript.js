//delete modal
const content = document.querySelector('#content')
const modal = document.querySelector('#exampleModal')
if (content) {
  content.addEventListener('click', function () {
    if (event.target.matches('.delete')) {
      const id = event.target.dataset.id
      const name = event.target.dataset.name
      modal.innerHTML =
        `<div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">確定刪除：${name}？</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
        <form action="/records/${id}?_method=DELETE" method="POST" class="btn">
          <button type="submit" class="btn btn-danger">刪除</button>
        </form>
      </div>
    </div>
  </div>`
    }
  })
}


//show number with commas
const totalAmount = document.querySelector('#totalAmount')

if (totalAmount) {
  totalAmount.innerText = getNumberWithCommas(totalAmount.innerText)
}

const recordAmount = document.querySelectorAll('.record-amount')
const records = Array.from(recordAmount)

if (records) {
  records.map(record => {
    record.innerText = getNumberWithCommas(record.innerText)
  })
}


//Setting background color of records
const recordRow = document.querySelectorAll('.record-row')
const rows = Array.from(recordRow)
rows.map((row, row_index) => {
  if (row_index % 2 === 1) {
    row.classList.add('row-background')
  }
})

//form validation from front-end
const form = document.querySelector('#form')
const submitButton = document.querySelector('#submit')

if (submitButton) {
  submitButton.addEventListener('click', function onSubmitClick() {
    form.classList.add('was-validated')
  })

  form.addEventListener('submit', function onFormSubmit() {
    if (!form.checkValidity()) {
      event.preventDefault()
      event.stopPropagation()
    }
  })
}

//function
function getNumberWithCommas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}