const content = document.querySelector('#content')
const modal = document.querySelector('#exampleModal')
content.addEventListener('click', function () {
  if (event.target.matches('.delete')) {
    const id = event.target.dataset.id
    const name = event.target.dataset.name
    modal.innerHTML =
      `<div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">確定刪除${name}？</h1>
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