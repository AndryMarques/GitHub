// Dados do GitHub/Json
const githubUsername = 'AndryMarques';
const githubToken = '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';
const jsonServerUrl = 'https://andry-marques.qualificartek20.repl.co/db';

// Função para buscar dados da API do GitHub
async function fetchGitHubData(endpoint) {
  const response = await fetch(`https://api.github.com/${endpoint}`, {
    headers: {
      'Authorization': `token ${githubToken}`
    }
  });

  if (!response.ok) {
    throw new Error(`Erro na solicitação da API do GitHub: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Buscar dados do usuário
fetchGitHubData(`users/${githubUsername}`)
  .then(userData => {
    document.getElementById('user-avatar').src = userData.avatar_url;
    document.getElementById('user-name').textContent = userData.name;
    document.getElementById('user-bio').textContent = userData.bio || "Sem descrição";
    document.getElementById('user-location').textContent = userData.location || "Não informado";
    document.getElementById('user-website').href = userData.blog || "#";
    document.getElementById('user-website').textContent = userData.blog || "Não informado";
    document.getElementById('user-followers').textContent = userData.followers;
  })
  .catch(error => console.error('Erro ao buscar dados do usuário:', error));

// Buscar repositórios do usuário
fetchGitHubData(`users/${githubUsername}/repos`)
  .then(reposData => {
    const reposContainer = document.getElementById('repos-container');
    const reposTitle = document.getElementById('repositorios').querySelector('h3'); // Declara a variável aqui

    reposContainer.innerHTML = ''; 

    if (reposData.length === 0) {
      reposContainer.innerHTML = '<p>Nenhum repositório encontrado.</p>';
      reposTitle.textContent = 'Repositórios (0)'; 
    } else {
      reposData.forEach(repo => {
        const repoCard = `
          <div class="col">
            <div class="card h-100">
              <div class="card-body">
                <a href="${repo.html_url}" target="_blank">
                  <h5 class="card-title">${repo.name}</h5>
                </a>
                <p class="card-text">${repo.description || "Sem descrição"}</p>
              </div>
              <div class="card-footer">
                <small class="text-muted">
                  <i class="bi bi-star-fill"></i> ${repo.stargazers_count} 
                  <i class="bi bi-eye-fill"></i> ${repo.watchers_count} 
                </small>
              </div>
            </div>
          </div>
        `;
        reposContainer.innerHTML += repoCard;
      });
      reposTitle.textContent = `Repositórios (${reposData.length})`;
    }
  })
  .catch(error => {
    console.error('Erro ao buscar repositórios:', error);
    const reposContainer = document.getElementById('repos-container');
    reposContainer.innerHTML = '<p>Ocorreu um erro ao carregar os repositórios.</p>';
    document.getElementById('repositorios').querySelector('h3').textContent = 'Repositórios';
  });


  // Função para buscar e exibir dados do JSON Server
async function fetchDataAndDisplay(endpoint, containerId, createElementFunction) {
    try {
      const response = await fetch(`${jsonServerUrl}/${endpoint}`);
      if (!response.ok) {
        throw new Error(`Erro ao buscar ${endpoint}: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
      const container = document.getElementById(containerId);
  
      data.forEach((item, index) => {
        const element = createElementFunction(item, index);
        container.appendChild(element);
      });
    } catch (error) {
      console.error(`Erro ao buscar ${endpoint}:`, error);
    }
  }
  
  // Função para criar os slides do carrossel
  function createCarouselItem(item, index) {
    const div = document.createElement('div');
    div.classList.add('carousel-item');
    if (index === 0) {
      div.classList.add('active');
    }
    div.innerHTML = `
      <img src="${item.imageUrl}" class="d-block w-100" alt="${item.title}">
      <div class="carousel-caption d-none d-md-block">
        <h5>${item.title}</h5>
        <p>${item.description}</p>
        <a href="${item.contentUrl}" class="btn btn-primary" target="_blank">Ver mais</a>
      </div>
    `;
    return div;
  }
  
  // Buscar e exibir o conteúdo sugerido no carrossel
  fetchDataAndDisplay('suggestedContent', 'carousel-inner', createCarouselItem);