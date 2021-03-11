interface Vendor {
  name: string;
  prefix: string;
  icons: string[];
}

export let ICONS: Vendor[] = [
  {
    name: 'Font Awesome 4.7',
    prefix: 'fa fa-',
    icons: [
      'slideshare',
      'snapchat',
      'snapchat-ghost',
      'snapchat-square',
      'soundcloud',
      'spotify',
      'stack-exchange',
      'stack-overflow'
    ]
  }
];

export function setIconVendor(icons: Vendor[]) {
  ICONS = icons;
}
