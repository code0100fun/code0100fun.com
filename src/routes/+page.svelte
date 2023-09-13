<section>
  <ul class="grid">
    <li class="post">
      <a href="/" class="text-xl text-primary-600">Second Post</a>
      <p class="text-primary-900">Apr 16, 2023</p>
      <ul>
        <li><a href="/" class="text-sm text-secondary-800">#sveltekit</a></li>
      </ul>
      <p class="description">Second post of the week 🎉</p>
      <a href="/" class="link">Read more</a>
    </li>
    <li class="post">
      <a href="/" class="text-xl text-primary-600">First Post</a>
      <p class="text-primary-900">Apr 14, 2023</p>
      <ul>
        <li><a href="/" class="text-sm text-secondary-800">#eBPF</a></li>
      </ul>
      <p class="description">Hello World 👋</p>
      <a href="/" class="link">Read more</a>
    </li>
  </ul>
</section>

<style>
  .post {
    @apply py-6;
  }

  .post:not(:last-child) {
    @apply border-b border-b-secondary-500;
  }
</style>
