document.addEventListener('DOMContentLoaded', () => {
    /* [MY DELIVERABLES]
      1. As a user, I should be able to enter a GitHub username on the input/search field.
      
      2. As a user, I should be able to click a submit (Search) button.
      
      3. As a user, I expect to see the results (or no results) of the username I enter at the DOM.

      4. As a user, I would be able to click on the result profile that would lead me to the actual GitHub profile.

      5. As a user, I would be able to expand the profle box to list out all the public repos.

      */

    const API_URL = "https://api.github.com/users/";

    const userCard = document.getElementById('usercard');
    const form = document.getElementById('form');
    const search = document.getElementById('search');
    const notFound = document.getElementById('notfound')
    const notFoundText = document.getElementById('notfound-message')
    notFound.className = 'hidden'

    function getUser(username) {
        return fetch(API_URL + username, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        })
            .then(resp => resp.json())
            .then(obj => {
                makeUserCard(obj);
                // getRepos(username);
            })
            .catch((err) => {
                notFound.removeAttribute('class')
                notFoundText.textContent = err
                setTimeout(() => { err.setAttribute('class', 'hidden') }, 3000)
            })

        function getRepos(username) {
            fetch(API_URL + username + "/repos", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
            })
                .then(resp => resp.json())
        }

        function addRepos(repos) {
            const reposEle = document.getElementById("reposlist");
            for (const repo in repos) {
                const repoEl = document.createElement("a");
                repoEl.classList.add("repo");
                repoEl.href = repo.html_url;
                repoEl.target = "_blank";
                repoEl.innerText = repo.name;
                reposEle.appendChild(repoEl);
            }
            /* repos.forEach((repo) => {
                const repoEl = document.createElement("a");
                repoEl.classList.add("repo");
                repoEl.href = repo.html_url;
                repoEl.target = "_blank";
                repoEl.innerText = repo.name;
                reposEle.appendChild(repoEl);
            }) */
        }

        function makeUserCard(user) {
            const profileCard = `
        <div class="card">
            <div>
                <img class="avatar card-img-top" src="${user.avatar_url}" alt="${user.name}" />
            </div>
            <div class="user-info card-body">
                <h3 class="card-title">${user.name}</h3>
                    <p class="card-text">${user.bio}</p>
                        <ul class="github-info">
                            <li><strong>Followers:</strong> ${user.followers}</li>
                            <li><strong>Following:</strong> ${user.following}</li>
                            <li><strong>Repos:</strong> ${user.public_repos}</li>
                            <li><strong>Twitter:</strong> ${user.twitter_username}</li>
                            <li><strong>Location:</strong> ${user.location}</li>
                        </ul>
                        <button type="button" class="btn btn-secondary" id="myBtn">Repos</button> <a href="${user.html_url}" class="btn btn-primary" target="_blank">Visit</a>
                        <div id="myCollapse" class="collapse">
                            <div id="reposlist" class="card card-body">
                            (repos list here...)
                            </div>
                        </div>
            </div>
        `;

            userCard.innerHTML = profileCard;
        }

    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        console.log(e.target)
        const user = search.value;
        if (user) {
            getUser(user);
            search.value = "";
        }
        form.reset();
    });

    /* From Bootstrap 5 Components docs (collapse/expand)
    const collapseElementList = document.querySelectorAll('.collapse')
    const collapseList = [...collapseElementList].map(collapseEl => new bootstrap.Collapse(collapseEl)) */

    const btn = document.getElementById("myBtn");
    const element = document.getElementById("myCollapse");

    // Create a collapse instance, toggles the collapse element on invocation
    const myCollapse = new bootstrap.Collapse(element);

    btn.addEventListener("click", () => {
        myCollapse.toggle();
    });

})