document.addEventListener('DOMContentLoaded', () => {
    /* [MY DELIVERABLES]
      1. As a user, I should be able to enter a GitHub username on the input/search field.
      
      2. As a user, I should be able to click a submit (Search) button and return a result.
      
      3. As a user, I expect to see the result (or no result) of the username I enter at the DOM. Every GitHub username is unique, there shouldn't be any "duplicate" usernames, so the result should only be 1 profile card.

      4. As a user, I would be able to click on the result profile that would lead me to the actual GitHub profile.

      5. As a user, I would be able to expand and collapse the profle card to list out the first 30 repos the profile has. Per the GitHub API docs, it only fetches 30 repos as the default, but can be customized to any number using their query

      */

    const API_URL = "https://api.github.com/users/"; // GitHub API URL here

    // List all the target elements
    const userCard = document.getElementById('usercard');
    const form = document.getElementById('form');
    const search = document.getElementById('search');
    const notFound = document.getElementById('notfound')
    const notFoundText = document.getElementById('notfound-message')
    notFound.className = 'hidden'

    // Fetch the GitHub profiles here
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
                getRepos(username);
            })
            .catch((err) => {
                notFound.removeAttribute('class')
                notFoundText.textContent = err
                setTimeout(() => { err.setAttribute('class', 'hidden') }, 3000)
            })

        // Fetch the user repos here
        function getRepos(username) {
            return fetch(API_URL + username + "/repos", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/vnd.github.v3+json",
                },
            })
                .then(resp => resp.json())
                .then((data) => {
                    showRepos(data);
                })
                .catch((err) => {
                    console.error("This user has this issue: ", error)
                    setTimeout(() => { err.setAttribute('class', 'hidden') }, 3000)
                })
        }

        function showRepos(repos) {
            const reposEl = document.getElementById("reposlist");
            repos.forEach((repo) => {
                const repoEl = document.createElement("a");
                repoEl.classList.add("repo");
                repoEl.href = repo.html_url;
                repoEl.target = "_blank";
                repoEl.innerText = repo.name;
                reposEl.appendChild(repoEl);
            })
        }

        // For every username search, create a GitHub profile card and appear at the "Results" section
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
                            <li><span class="ghinfo-labels">Followers:</span> ${user.followers}</li>
                            <li><span class="ghinfo-labels">Following:</span> ${user.following}</li>
                            <li><span class="ghinfo-labels">Repos:</span> ${user.public_repos}</li>
                            <li><span class="ghinfo-labels">Twitter:</span> <a href="https://twitter.com/${user.twitter_username}"><span class="twitter">@${user.twitter_username}</span></a></li>
                            <li><span class="ghinfo-labels">Location:</span> ${user.location}</li>
                        </ul>
                        <a href="${user.html_url}" class="btn btn-primary" target="_blank">Visit</a> <button type="button" class="repobtn btn btn-secondary">Repos</button> 
                        </div>
                        <div id="reposlist"></div>
                        
            </div>
        `;

            userCard.innerHTML = profileCard;
        }

    }

    // Search for a GitHub username here
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

    // Expand and collapse the repos list

    const btn = document.querySelector('.repobtn');
    const reposList = document.querySelector('#reposlist');

    btn.addEventListener("click", () => {
        if (reposList.style.visibility !== "hidden") {
            reposList.style.display = "visible";
        } else {
            reposList.style.display = "hidden";
        }
    })

    /* btn.addEventListener("click", () => {
        if (reposList.style.display !== "none") {
            reposList.style.display = "none";
        } else {
            reposList.style.display = "block";
        }
    }) */

    /* btn.addEventListener("click", () => {
        this.classList.toggle("active");
        const reposList = this.nextElementSibling;
        if (reposList.style.display === "block") {
            reposList.style.display = "none";
        } else {
            reposList.style.display = "block";
        }
    }); */

    /* const btn = document.getElementById('reposbtn')
    const element = document.getElementById('collapsible')

    const myCollapsible = new bootstrap.Collapse(element)

    btn.addEventListener("click", () => {
        myCollapsible.toggle();
    }) */


    /* btn.addEventListener("click", (e) => {
        e.preventDefault();
        btn.classList.toggle('show-repo');
        btn.classList.toggle('hide-repo');
    }) */

    /* From Bootstrap 5 Components docs (collapse/expand)
    const collapseElementList = document.querySelectorAll('.collapse')
    const collapseList = [...collapseElementList].map(collapseEl => new bootstrap.Collapse(collapseEl))

    const btn = document.getElementById("myBtn");
    const element = document.getElementById("myCollapse");

    // Create a collapse instance, toggles the collapse element on invocation
    const myCollapse = new bootstrap.Collapse(element);

    btn.addEventListener("click", () => {
        myCollapse.toggle();
    }); */

})