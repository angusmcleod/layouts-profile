# name: discourse-profile-widget
# about: A profile widget that works with discourse-layouts
# version: 0.1
# authors: Angus McLeod

register_asset 'stylesheets/profile-widget.scss'

after_initialize do
  DiscourseLayouts::WidgetHelper.add_widget('profile')
end
