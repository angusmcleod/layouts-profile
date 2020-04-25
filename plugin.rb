# name: layouts-profile
# about: A profile widget that works with discourse-layouts
# version: 0.1
# authors: Angus McLeod

register_asset 'stylesheets/layouts-profile.scss'

DiscourseEvent.on(:layouts_ready) do
  DiscourseLayouts::Widget.add('profile', position: 'left', order: 'start')
end
