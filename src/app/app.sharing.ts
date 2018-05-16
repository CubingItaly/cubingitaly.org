import { ShareButtonsOptions } from "@ngx-share/core";

export const sharingOptions: ShareButtonsOptions = {
  include: ['facebook', 'twitter', 'google', 'telegram', 'whatsapp'],
  exclude: ['tumblr', 'stumble', 'vk'],
  theme: 'default',
  autoSetMeta: true  
}