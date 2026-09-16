interface ProjectBase {
  name: string;
  url: string;
  icon: string;
}
export interface PublicProject extends ProjectBase {
  status: 'public';
  description: string;
  language: string;
  category: string;
}
export interface UpcomingProject extends ProjectBase {
  status: 'coming-soon';
  description?: string;
  language?: string;
  category?: string;
}
export type Project = PublicProject | UpcomingProject;

// Change status to public and supply metadata when a repository opens.
// Coming-soon URLs are kept here but never rendered as links.
export const projects: Project[] = [
  {
    name: 'bees',
    status: 'public',
    description:
      'A lightweight, SQLite-backed issue tracker that lives in your project directory. One binary, local-first.',
    language: 'Zig',
    category: 'Developer tools',
    icon: 'terminal',
    url: 'https://github.com/ctxshift/bees',
  },
  {
    name: 'clinex',
    status: 'public',
    description:
      'Terminal interfaces over SSH for Phoenix applications, with LiveView-style callbacks and declarative templates.',
    language: 'Elixir',
    category: 'Terminal interfaces',
    icon: 'terminal',
    url: 'https://github.com/ctxshift/clinex',
  },
  {
    name: 'video-feed',
    status: 'public',
    description:
      'Video transcripts from local Whisper, corrected against on-screen text with a Gemini vision pass.',
    language: 'TypeScript',
    category: 'Video & transcription',
    icon: 'code',
    url: 'https://github.com/ctxshift/video-feed',
  },
  {
    name: 'zig-verilator',
    status: 'public',
    description:
      'Typed Zig bindings for SystemVerilog modules. Build hardware simulations and write testbenches in Zig.',
    language: 'Zig',
    category: 'Hardware & tooling',
    icon: 'chip',
    url: 'https://github.com/code0100fun/zig-verilator',
  },
  {
    name: 'gb-gowin',
    status: 'public',
    description:
      'A Game Boy DMG implementation in SystemVerilog for the Tang Nano 20K FPGA. A work in progress.',
    language: 'SystemVerilog',
    category: 'HDL & hardware',
    icon: 'gamepad',
    url: 'https://github.com/code0100fun/gb-gowin',
  },
  {
    name: 'zeo',
    status: 'coming-soon',
    icon: 'code',
    url: 'https://github.com/ctxshift/zeo',
  },
  {
    name: 'phx_mobile',
    status: 'coming-soon',
    icon: 'code',
    url: 'https://github.com/ctxshift/phx_mobile',
  },
  {
    name: 'nvrhi-zig',
    status: 'coming-soon',
    icon: 'code',
    url: 'https://github.com/ctxshift/nvrhi-zig',
  },
  {
    name: 'firefly',
    status: 'coming-soon',
    icon: 'code',
    url: 'https://github.com/code0100fun/firefly',
  },
  {
    name: 'typhon',
    status: 'coming-soon',
    icon: 'code',
    url: 'https://github.com/code0100fun/typhon',
  },
];
export const publicProjects = projects.filter(
  (project): project is PublicProject => project.status === 'public',
);
export const upcomingProjects = projects.filter(
  (project): project is UpcomingProject => project.status === 'coming-soon',
);
