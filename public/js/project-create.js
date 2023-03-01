// Skill
let skillsChoosen = [];

const renderSkillChoosenInForm = () => {
  const skillsChoosenEl = useQuery('#skill-choosen-input');
  skillsChoosenEl.innerHTML = '';
  skillsChoosen.forEach((skill) => {
    const skillTag = document.createElement('p');
    skillTag.classList.add('skill-tag');

    const deleteSkillTag = document.createElement('span');
    deleteSkillTag.classList.add('delete-skill-tag');
    deleteSkillTag.innerHTML = 'x';
    deleteSkillTag.onclick = () => {
      skillsChoosen = skillsChoosen.filter(
        (skillChoosen) => skillChoosen.id != skill.id,
      );
      skillsChoosenEl.removeChild(skillTag);
    };

    skillTag.innerHTML = skill.name;
    skillTag.appendChild(deleteSkillTag);
    skillsChoosenEl.appendChild(skillTag);
  });
};
renderSkillChoosenInForm();

useQuery('#add-skill').onclick = () => {
  resetModal();
  const modal = useQuery('.modal');
  modal.classList.remove('member-list-modal');
  modal.classList.add('skill-list-modal');

  const skillsChoosenEl = document.createElement('div');
  skillsChoosenEl.classList.add('skill-choosen');
  modal.appendChild(skillsChoosenEl);

  const renderSkillsChoosen = () => {
    skillsChoosenEl.innerHTML = '';
    skillsChoosen.forEach((skill) => {
      const skillTag = document.createElement('p');
      skillTag.classList.add('skill-tag');

      const deleteSkillTag = document.createElement('span');
      deleteSkillTag.classList.add('delete-skill-tag');
      deleteSkillTag.innerHTML = 'x';
      deleteSkillTag.onclick = () => {
        skillsChoosen = skillsChoosen.filter(
          (skillChoosen) => skillChoosen.id != skill.id,
        );
        skillsChoosenEl.removeChild(skillTag);
        renderSkillChoosenInForm();
      };

      skillTag.innerHTML = skill.name;
      skillTag.appendChild(deleteSkillTag);
      skillsChoosenEl.appendChild(skillTag);
    });
  };

  const skillListEl = document.createElement('div');
  skillListEl.classList.add('skill-list');
  modal.appendChild(skillListEl);

  const renderSkillList = (query) => {
    skillListEl.innerHTML = '';
    let skillList = JSON.parse(useQuery('#skill-list').value);
    if (query) {
      skillList = skillList.filter((val) =>
        val.name.toLowerCase().includes(query.toLowerCase().trim()),
      );
    }
    skillList.forEach((skill, index) => {
      const skillEl = document.createElement('p');
      skillEl.classList.add('skill');
      skillEl.innerHTML = index + 1 + '. ' + skill.name;
      skillEl.onclick = () => {
        if (skillsChoosen.findIndex((val) => val.id == skill.id) == -1) {
          skillsChoosen.push(skill);
          renderSkillsChoosen();
          renderSkillChoosenInForm();
        }
      };
      skillListEl.appendChild(skillEl);
    });
  };

  renderSkillsChoosen();
  renderSkillList();
  showModal();

  const searchInput = useQuery('.search-input');
  searchInput.onkeyup = () => {
    renderSkillList(searchInput.value);
  };
};

// Member
let members = [];
useQuery('#add-member').onclick = () => {
  const modal = useQuery('.modal');
  resetModal();
  modal.classList.remove('skill-list-modal');
  modal.classList.add('member-list-modal');
  showModal();
};

const resetModal = () => {
  const modal = useQuery('.modal');
  modal.innerHTML = ` 
    <div class="search-container">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" class="search-icon">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M10.6002 12.0498C9.49758 12.8568 8.13777 13.3333 6.66667 13.3333C2.98477 13.3333 0 10.3486 0 6.66667C0 2.98477 2.98477 0 6.66667 0C10.3486 0 13.3333 2.98477 13.3333 6.66667C13.3333 8.15637 12.8447 9.53194 12.019 10.6419C12.0265 10.6489 12.0338 10.656 12.0411 10.6633L15.2935 13.9157C15.6841 14.3063 15.6841 14.9394 15.2935 15.33C14.903 15.7205 14.2699 15.7205 13.8793 15.33L10.6269 12.0775C10.6178 12.0684 10.6089 12.0592 10.6002 12.0498ZM11.3333 6.66667C11.3333 9.244 9.244 11.3333 6.66667 11.3333C4.08934 11.3333 2 9.244 2 6.66667C2 4.08934 4.08934 2 6.66667 2C9.244 2 11.3333 4.08934 11.3333 6.66667Z"></path>
        </svg>
        <input type="text" class="search-input" name="key_search" placeholder="Tìm kiếm...">
    </div>`;
};
