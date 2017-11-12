# name: layouts-profile
# about: A profile widget that works with discourse-layouts
# version: 0.1
# authors: Angus McLeod

register_asset 'stylesheets/layouts-profile.scss'

after_initialize do
  DiscourseLayouts::WidgetHelper.add_widget('profile', position: 'left', order: 'start')
end
