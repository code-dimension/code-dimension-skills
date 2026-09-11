import { Skill } from './skill.model';

/**
 * Add or edit catalog entries here. Categories and creators are used to build
 * the filter options automatically.
 */
export const SKILLS: readonly Skill[] = [
  {
    id: 'angular-arch',
    name: 'Angular Architecture',
    installCommand:
      'npx skills add code-dimension/code-dimension-skills --skill angular-arch',
    category: 'Architecture',
    description:
      'Opinionated guidance for organizing Angular applications into clear core, feature, and shared boundaries.',
    creator: 'Code Dimension',
  },
  {
    id: 'daisy-ui-v5',
    name: 'daisyUI v5',
    installCommand:
      'npx skills add code-dimension/code-dimension-skills --skill daisy-ui-v5',
    category: 'UI & Styling',
    description:
      'Practical conventions for accessible daisyUI 5 components, semantic themes, and responsive layouts.',
    creator: 'Code Dimension',
  },
  {
    id: 'angular-developer',
    name: 'Angular Developer',
    installCommand: 'npx skills add angular/angular --skill angular-developer',
    category: 'Development',
    description:
      'Current Angular guidance for components, signals, forms, routing, testing, accessibility, and tooling.',
    creator: 'Angular',
  },
];
