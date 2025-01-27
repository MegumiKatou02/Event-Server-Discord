<template>
  <div class="main-container">
    <h1 @click="updateMessage(currentCode)" class="title">Event Code: {{ eventCode }}</h1>
    <div class="search-container">
      <div class="search-wrapper">
        <input
          type="text"
          v-model="searchQuery"
          @keyup.enter="handleSearch"
          placeholder="Event Code (e.g. 1, 2, 3...)"
          class="search-input"
        />
        <button
          @click="handleSearch"
          class="search-button"
        >
          Tìm kiếm
        </button>
      </div>

      <div class="filter-section">
        <div class="filter-group">
          <label class="filter-label">Lọc theo:</label>
          <select v-model="filterBy" class="filter-select">
            <option value="id">ID</option>
            <option value="globalname">Tên</option>
            <option value="registeredAt">Ngày đăng ký</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">Thứ tự:</label>
          <select v-model="sortOrder" class="filter-select">
            <option value="asc">Tăng dần</option>
            <option value="desc">Giảm dần</option>
          </select>
        </div>

        <button
          @click="applyFilters"
          class="filter-button"
        >
          Lọc dữ liệu
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, ref, unref } from 'vue'
import type { User } from '@/types/users';

export default defineComponent({
  name: 'SearchFilterComponent',
  props: {
    eventCode: {
      type: String,
      required: true,
    },
    currentCode: {
      type: String,
      required: true,
    },
  },
  setup() {
    const searchQuery = ref<string>('')
    const filterBy = ref<string>('id')
    const sortOrder = ref<string>('asc')

    const { updateMessage } = inject('message', {
      updateMessage: (message: string) => {
        console.log(message)
      }
    });

    const { users, updateUsers } = inject('userslist', {
      users: ref<User[]>([]),
      updateUsers: (usersList: User[]) => {
        console.log(usersList);
      }
    })

    const applyFilters = () => {
      // console.log(filterBy.value)
      // console.log(sortOrder.value)
      const usersArray = unref(users);
      if (Array.isArray(usersArray)) {
        const sortProperty = filterBy.value as keyof User;
        const sortDirection = sortOrder.value === 'asc' ? 1 : -1;

        const sortedUsers = [...usersArray].sort((a, b) => {
          const valueA = a[sortProperty].toString().trim().toLowerCase();
          const valueB = b[sortProperty].toString().trim().toLowerCase();

          if (valueA < valueB) return -1 * sortDirection;
          if (valueA > valueB) return 1 * sortDirection;
          return 0;
        });

        updateUsers(sortedUsers);
      } else {
        console.error('users is not an array:', usersArray);
      }
    }

    const handleSearch = () => {
      if (searchQuery.value.trim() !== '') {
        updateMessage(`${searchQuery.value}`)
      }
    }

    return {
      searchQuery,
      filterBy,
      sortOrder,
      handleSearch,
      applyFilters,
      updateMessage
    }
  }
})
</script>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  margin-bottom: auto;
  padding-top: 0.5rem;
}

.search-container {
  width: 100%;
  padding: 1rem;
  background-color: #ffe4e1;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  font-family: 'Playwrite IN', serif;
  color: #9a5a6f;
  font-size: 2rem;
  margin-bottom: 1rem;
  text-shadow: 1px 1px 3px rgba(255, 255, 255, 0.5);
  cursor: pointer;
}

.search-wrapper {
  display: flex;
  width: 100%;
  max-width: 500px;
  margin-bottom: 1rem;
}

.search-input {
  flex-grow: 1;
  padding: 0.5rem 1rem;
  border: 1px solid #e6a0b3;
  border-right: none;
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
  outline: none;
  background-color: #fff5f8;
}

.search-button {
  padding: 0.5rem 1rem;
  background-color: #ff6b9e;
  color: white;
  border: none;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.1s;
}

.search-button:hover {
  background-color: #ff4f87;
  transform: scale(1.02);
}

.filter-section {
  display: flex;
  gap: 1rem;
  align-items: center;
  max-width: 500px;
  justify-content: space-between;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-label {
  margin-bottom: 0.25rem;
  color: #8a4b5f;
  font-size: 0.9rem;
}

.filter-select {
  padding: 0.5rem;
  border: 1px solid #e6a0b3;
  border-radius: 6px;
  background-color: #fff5f8;
}

.filter-button {
  padding: 0.5rem 1rem;
  background-color: #ff6b9e;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.1s;
  align-self: flex-end;
}

.filter-button:hover {
  background-color: #ff4f87;
  transform: scale(1.02);
}
</style>
