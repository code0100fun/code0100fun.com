<header class="flex flex-col">
  <div class="flex header_logo">
    <div class="flex flex-row w-full bg-secondary-600">
      <div class="text-on-primary-token bg-primary-600 px-3">code0100fun.com</div>
      <div class="arrow-right" />
      <div class="flex-1" />
      <div class="arrow-left" />
      <nav>
        <ul class="grid grid-cols-2 gap-3 pl-3 bg-tertiary-600">
          <li>About</li>
          <li>RSS</li>
        </ul>
      </nav>
    </div>
  </div>
</header>

<style>
  .arrow-right {
    border: 0.75rem solid transparent;
    width: 0;
    height: 0;
    border-left: 0.75rem solid rgba(var(--color-primary-600));
    z-index: 1;
  }

  .arrow-left {
    width: 0;
    height: 0;
    border-top: 0.75rem solid transparent;
    border-bottom: 0.75rem solid transparent;
    border-right: 0.75rem solid rgba(var(--color-tertiary-600));
  }
</style>
