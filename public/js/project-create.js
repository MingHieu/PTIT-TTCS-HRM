/******************************/
/***********SKILL**************/
/******************************/
let skillChosenList = [];
if (useQuery('#skill-chosen-list')) {
  skillChosenList = JSON.parse(useQuery('#skill-chosen-list').value);
}
const renderSkillChosen = (container, isInModal = false) => {
  container.innerHTML = '';
  const deleteButtonClass = isInModal
    ? 'delete-skill-tag-modal'
    : 'delete-skill-tag';
  skillChosenList.forEach((skill) => {
    container.innerHTML += `
      <p class="skill-tag">
        ${skill.name}<span class="${deleteButtonClass}">x</span>
      </p>`;
  });
  useQueryAll(`.${deleteButtonClass}`).forEach((deleteButton, index) => {
    deleteButton.onclick = () => {
      skillChosenList.splice(index, 1);
      renderSkillChosen(useQuery('.skill-chosen-list'));
      if (isInModal) {
        renderSkillChosen(useQuery('.skill-chosen-list-modal'), true);
      }
    };
  });
};
renderSkillChosen(useQuery('.skill-chosen-list'));
useQuery('#add-skill').onclick = () => {
  resetModal();
  const modal = useQuery('.modal');
  modal.classList.remove('member-list-modal');
  modal.classList.add('skill-list-modal');

  const skillChosenListEl = document.createElement('div');
  skillChosenListEl.classList.add('skill-chosen-list-modal');
  modal.appendChild(skillChosenListEl);

  renderSkillChosen(skillChosenListEl, true);

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
        if (skillChosenList.findIndex((val) => val.id == skill.id) == -1) {
          skillChosenList.push(skill);
          renderSkillChosen(skillChosenListEl, true);
          renderSkillChosen(useQuery('.skill-chosen-list'));
        }
      };
      skillListEl.appendChild(skillEl);
    });
  };

  const searchInput = useQuery('.search-input');
  searchInput.onkeyup = () => {
    renderSkillList(searchInput.value);
  };

  renderSkillList();
  showModal();
};

/******************************/
/***********MEMBER**************/
/******************************/
let memberChosenList = [];
if (useQuery('#member-chosen-list')) {
  memberChosenList.push(...JSON.parse(useQuery('#member-chosen-list').value));
  const leader = JSON.parse(useQuery('#leader').value);
  memberChosenList.splice(
    memberChosenList.findIndex((member) => member.username == leader.username),
    1,
  );
  leader.leader = true;
  memberChosenList.unshift(leader);
}
const renderMemberChosen = (container, isInModal = false) => {
  container.innerHTML = '';
  const deleteButtonClass = isInModal
    ? 'member-el__delete'
    : 'member-el__delete-modal';
  memberChosenList.forEach((member, index) => {
    container.innerHTML += `
      <div class="member-el">
        <div class="member-el__information">
          <img class="member-el__avatar" src="${
            member.avatar || '/img/default-user.jpeg'
          }" />
          <div>
              <div class="member-el__username">${member.username}</div>
              <div class="member-el__name">${member.name}</div>
          </div>
        </div>
        <div class="member-el__button-container">
          <i class="${
            member.leader ? 'fa-solid' : 'fa-regular'
          } fa-star leader-button"></i>
          <i class="fa-solid fa-square-minus ${deleteButtonClass}"></i>
        </div>
      </div>`;
  });
  useQueryAll(`.leader-button`).forEach((leaderButton, index) => {
    leaderButton.onclick = () => {
      if (memberChosenList[index].leader) return;
      const member = memberChosenList.splice(index, 1);
      memberChosenList.unshift(...member);
      memberChosenList[0].leader = true;
      if (memberChosenList.length > 1) {
        memberChosenList[1].leader = false;
      }
      renderMemberChosen(useQuery('.member-chosen-list'));
      if (isInModal) {
        renderSkillChosen(useQuery('.member-chosen-list-modal'), true);
      }
    };
  });
  useQueryAll(`.${deleteButtonClass}`).forEach((deleteButton, index) => {
    deleteButton.onclick = () => {
      memberChosenList.splice(index, 1);
      renderMemberChosen(useQuery('.member-chosen-list'));
      if (isInModal) {
        renderSkillChosen(useQuery('.member-chosen-list-modal'), true);
      }
    };
  });
};
renderMemberChosen(useQuery('.member-chosen-list'));
useQuery('#add-member').onclick = () => {
  const modal = useQuery('.modal');
  resetModal();
  modal.classList.remove('skill-list-modal');
  modal.classList.add('member-list-modal');

  const memberListEl = document.createElement('div');
  memberListEl.classList.add('member-list');
  modal.appendChild(memberListEl);

  let members = [];
  let timer;

  const searchMember = (query) => {
    clearTimeout(timer);
    if (query) {
      renderMemberList({ loading: true });
      timer = setTimeout(() => {
        fetch(`${location.origin}/employee/all?key_search=${searchInput.value}`)
          .then((res) => res.json())
          .then((data) => {
            members = data.data;
            renderMemberList();
          });
      }, 2000);
    } else {
      members = [];
      renderMemberList({ firstTime: true });
    }
  };

  const renderMemberList = (props) => {
    if (props?.loading) {
      if (useQuery('.member-loading')) {
        return;
      }
      memberListEl.innerHTML = `
      <div style="flex: 1;display: flex;justify-content: center;align-items: center;">
        <lottie-player class="member-loading" src="https://assets10.lottiefiles.com/packages/lf20_ht6o1bdu.json"  background="transparent"  speed="1"  style="width: 200px; height: 200px;"  loop  autoplay></lottie-player>
      </div> 
        `;
    } else if (props?.firstTime) {
      memberListEl.innerHTML =
        '<p class="member-list-empty">Tìm kiếm người cho dự án</p>';
    } else if (!members.length) {
      memberListEl.innerHTML =
        '<p class="member-list-empty">Không tìm thấy</p>';
    } else {
      memberListEl.innerHTML = '';
      members.forEach((member) => {
        memberListEl.innerHTML += `
        <div class="member-el member-el-modal" style="cursor:pointer">
          <div class="member-el__information">
            <img class="member-el__avatar" src="${
              member.avatar || '/img/default-user.jpeg'
            }" />
            <div>
                <div class="member-el__username">${member.username}</div>
                <div class="member-el__name">${member.name}</div>
            </div>
          </div>
        </div>
      `;
      });
      useQueryAll('.member-el-modal').forEach((el, index) => {
        el.onclick = () => {
          if (
            memberChosenList.findIndex(
              (member) => member.username == members[index].username,
            ) == -1
          ) {
            memberChosenList.push(members[index]);
            renderMemberChosen(useQuery('.member-chosen-list'));
          }
        };
      });
    }
  };

  const searchInput = useQuery('.search-input');
  searchInput.oninput = () => {
    searchMember(searchInput.value);
  };

  renderMemberList({ firstTime: true });
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

/********************/
/****SUBMIT FORM****/
/********************/
const form = useQuery('form');
form.onsubmit = (e) => {
  e.preventDefault();
  showLoading();
  const formData = new FormData(form);
  const body = {};
  formData.forEach((value, key) => (body[key] = value));
  body.status = +body.status;
  body.skills = skillChosenList.map((skill) => skill.id);
  body.members = memberChosenList.map((member) => ({
    username: member.username,
    leader: member.leader,
  }));
  fetch(location.pathname, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
    .then((res) => {
      if (!res.ok) throw new Error();
      setTimeout(() => {
        hideLoading();
      }, 1000);
      showToast(
        location.pathname.includes('edit')
          ? 'Chỉnh sửa thành công'
          : 'Tạo mới thành công',
      );
      if (!location.pathname.includes('edit')) {
        form.reset();
        skillChosenList = [];
        renderSkillChosen(useQuery('.skill-chosen-list'));
        memberChosenList = [];
        renderMemberChosen(useQuery('.member-chosen-list'));
      }
    })
    .catch((e) => {
      console.log(e);
      setTimeout(() => {
        hideLoading();
      }, 1000);
      showToast(
        location.pathname.includes('edit')
          ? 'Chỉnh sửa thất bại'
          : 'Tạo mới thất bại',
        false,
      );
    });
};

useQuery('a[href="delete"').onclick = (e) => {
  e.preventDefault();
  Swal.fire({
    title: 'Bạn có chắc muốn xoá dự án này?',
    icon: 'warning',
    showCancelButton: true,
    cancelButtonText: 'Huỷ',
    confirmButtonText: 'Đồng ý',
    confirmButtonColor: 'red',
  }).then((result) => {
    if (result.isConfirmed) {
      location.replace(
        `${location.origin}/project/${location.pathname.split('/')[2]}/delete`,
      );
    }
  });
};
