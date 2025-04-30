// Função para buscar a lista de doenças (endpoint GET /doenca)
async function fetchDoencas() {
    try {
      const res = await fetch('/doenca');
      if (!res.ok) throw new Error("Erro ao buscar doenças");
      return await res.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  
  // Atualiza a lista exibida na página
  async function displayDoencas() {
    const listContainer = document.getElementById('doenca-list');
    listContainer.innerHTML = ""; // Limpa a lista
    const doencas = await fetchDoencas();
    doencas.forEach(doenca => {
      const div = document.createElement('div');
      div.className = "doenca-item";
      div.innerHTML = `
        <span><strong>${doenca.titulo}</strong> - ${doenca.descricao}</span>
        <div class="action-btn-container">
          <button class="action-btn update-btn" onclick="populateForm(${doenca.id})">Atualizar</button>
          <button class="action-btn delete-btn" onclick="deleteDoenca(${doenca.id})">Excluir</button>
        </div>
      `;
      listContainer.appendChild(div);
    });
  }
  
  // Adiciona um novo campo de link no final do container
  function addLinkInput(value = "") {
    const container = document.getElementById('link-container');
    const div = document.createElement('div');
    div.className = "link-item";
    div.innerHTML = `
      <input type="text" name="links[]" value="${value}" required>
      <button type="button" class="remove-link-btn">x</button>
    `;
    container.appendChild(div);
  }
  
  // Inicializa a página adicionando um campo em branco
  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('link-container').innerHTML = "";
    addLinkInput();
    document.getElementById('add-link-btn').addEventListener('click', function() {
      addLinkInput();
    });
    
    // Delegação de evento para remover campo de link
    document.getElementById('link-container').addEventListener('click', function(e) {
      if (e.target && e.target.classList.contains('remove-link-btn')) {
        e.target.parentElement.remove();
      }
    });
  
    // Tratamento de envio do formulário (criação ou atualização)
    document.getElementById('crud-form').addEventListener('submit', async function(e) {
      e.preventDefault(); // Evita o envio tradicional do formulário
      const formData = new FormData(this);
      const id = formData.get('doenca-id');
      let links = formData.getAll('links[]');
      links = links.filter(link => link.trim() !== ""); // Remove campos vazios
      const payload = {
        titulo: formData.get('titulo'),
        descricao: formData.get('descricao'),
        author: formData.get('author'),
        sintomas: formData.get('sintomas'),
        links: links
      };
      try {
        let res;
        if (id) {
          // Atualização via PUT
          res = await fetch(`/doenca/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        } else {
          // Criação via POST
          res = await fetch(`/doenca`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        }
        if (!res.ok) throw new Error("Falha ao salvar a doença.");
        // Limpa o formulário e reinicia os campos de link
        this.reset();
        document.getElementById('doenca-id').value = "";
        document.getElementById('cancel-update').style.display = 'none';
        document.getElementById('link-container').innerHTML = "";
        addLinkInput();
        await displayDoencas();
      } catch (err) {
        console.error(err);
        alert("Erro ao salvar a doença: " + err.message);
      }
    });
  
    // Botão de cancelar atualização
    document.getElementById('cancel-update').addEventListener('click', function() {
      document.getElementById('crud-form').reset();
      document.getElementById('doenca-id').value = "";
      this.style.display = 'none';
      document.getElementById('link-container').innerHTML = "";
      addLinkInput();
    });
    
    displayDoencas();
  });
  
  // Popula o formulário para atualização com os dados do registro
  async function populateForm(id) {
    try {
      const res = await fetch(`/doenca/${id}`);
      if (!res.ok) throw new Error("Erro ao buscar dados para atualização.");
      const doenca = await res.json();
      document.getElementById('doenca-id').value = doenca.id;
      document.getElementById('titulo').value = doenca.titulo;
      document.getElementById('descricao').value = doenca.descricao;
      document.getElementById('author').value = doenca.author;
      document.getElementById('sintomas').value = doenca.sintomas;
      const container = document.getElementById('link-container');
      container.innerHTML = "";
      if (Array.isArray(doenca.links)) {
        doenca.links.forEach(link => {
          addLinkInput(link);
        });
      } else if (doenca.links) {
        addLinkInput(doenca.links);
      }
      document.getElementById('cancel-update').style.display = 'block';
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar os dados para atualização.");
    }
  }
  
  // Função para excluir um registro (DELETE) sem pop-up de confirmação
  async function deleteDoenca(id) {
    try {
      const res = await fetch(`/doenca/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Erro ao excluir a doença.");
      await displayDoencas();
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir a doença: " + error.message);
    }
  }
  