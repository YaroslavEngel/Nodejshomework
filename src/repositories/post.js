const posts = [
  {
    id: 1,
    title: 'Вступ до Node.js',
    content: "Node.js — це середовище виконання JavaScript, побудоване на движку V8 від Chrome.",
    author: 'Олена',
    category: 'programming',
  },
  {
    id: 2,
    title: 'Розуміння Express Middleware',
    content: 'Middleware-функції мають доступ до об\'єктів запиту та відповіді.',
    author: 'Іван',
    category: 'programming',
  },
  {
    id: 3,
    title: 'Найкращі способи заварювання кави',
    content: 'Пуровер, френч-прес та еспресо розкривають різні смакові відтінки.',
    author: 'Марія',
    category: 'lifestyle',
  },
  {
    id: 4,
    title: 'Початок роботи з REST API',
    content: 'REST — це архітектурний стиль для проєктування мережевих застосунків.',
    author: 'Петро',
    category: 'programming',
  },
  {
    id: 5,
    title: 'Подорожі з обмеженим бюджетом',
    content: "Щоб побачити світ, не обов'язково мати багато грошей.",
    author: 'Олена',
    category: 'travel',
  },
];

let nextId = posts.length + 1;


function getAll(category, take) {
  let result = posts;

  if (category) {
    result = result.filter((post) => post.category === category);
  }

  if (take !== undefined) {
    result = result.slice(0, take);
  }

  return result;
}

function getById(id) {
  return posts.find((post) => post.id === id);
}


function addPost(data) {
  return new Promise((resolve) => {
    const newPost = {
      id: nextId++,
      title: data.title,
      content: data.content,
      author: data.author ?? 'Anonymous',
      category: data.category ?? 'general',
    };

    posts.push(newPost);
    resolve(newPost);
  });
}

export default {
  getAll,
  getById,
  addPost,
};