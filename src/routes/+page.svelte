<script lang="ts">
  import { formatDate } from '$lib/utils/date'
  export let data
</script>

<section>
  <ul class="grid">
    {#each data.posts as post}
      <li class="post">
        <a href="/posts/{post.slug}" class="text-xl text-primary-600">{post.title}</a>
        <p class="text-primary-900">{formatDate(post.date)}</p>
        <ul class="flex flex-row gap-2">
          {#each post.categories as category}
            <li>
              <a href="/categories/{category}" class="text-sm text-secondary-800">#{category}</a>
            </li>
          {/each}
        </ul>
        <p class="description">{post.description}</p>
        <a href="/posts/{post.slug}" class="link">Read more</a>
      </li>
    {/each}
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
