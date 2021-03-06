document.addEventListener('DOMContentLoaded', () => {
    /* [MY DELIVERABLES]
      1. As a user, I should be able to enter a GitHub username on the input/search field.
      
      2. As a user, I should be able to click a submit (Search) button and return a result.
      
      3. As a user, I expect to see the result (or no result) of the username I enter at the DOM. Every GitHub username is unique, there shouldn't be any "duplicate" usernames, so the result should only be 1 profile card.

      4. As a user, I would be able to click on the result profile that would lead me to the actual GitHub profile.

      5. As a user, I would be able to expand and collapse the profle card to list out the first 30 repos the profile has. If the profile has exactly 30 or less repos, the fetch will return all the repos. Per the GitHub API docs, it only fetches 30 repos as the default, but can be customized to any spcific number of repos.

      6. As a user, when I click the "Repos" button again to hide the repos list, I should see a window alert reminding me to visit the actual GitHub profile page to see more of that profile's repos.

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
            })

        // Fetch the user repos here. If the GitHub profile has 30 or more repos, the fetch will only return 30 repos as default (GitHub API Docs). Otherwise, it will list all the user's repos if they have only 30 or less.
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
                    console.error("This user profile has a problem: ", error)
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

        // For every username search, create a GitHub profile card and appear at the "Results" section with the most basic info along with the repos list hidden, unless if the "Repos" button is clicked.
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
                        <button type="button" id="repobtn" class="btn btn-secondary" data-bs-toggle="collapse" data-bs-target="#collapseRepos">Repos</button> <a href="${user.html_url}" class="btn btn-primary" target="_blank">Visit</a>  
                        </div>
                        <div id="collapseRepos" class="collapse hide">
                            <div id="reposlist"></div>
                        </div>
                        
            </div>
        `;

            userCard.innerHTML = profileCard;
        }

    }

    // Search a GitHub profile via username
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

    // Show and hide the repos list (Bootstrap 5 Collapse Component)

    const reposList = document.getElementById("#collapseRepos");

    reposList.addEventListener("hide.bs.collapse", () => {
        alert("Please visit the user's profile on GitHub to view more repos.")
    })


})