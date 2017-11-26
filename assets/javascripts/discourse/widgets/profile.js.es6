import { createWidget } from 'discourse/widgets/widget';
import ComponentConnector from 'discourse/widgets/component-connector';
import { h } from 'virtual-dom';
import { avatarImg } from 'discourse/widgets/post';

export default createWidget('profile', {
  tagName: 'div.user-profile.widget-container',
  buildKey: () => 'user-profile',

  defaultState(attrs) {
    return {
      topic: attrs.topic,
      bookmarked: attrs.topic ? attrs.topic.bookmarked : null
    };
  },

  canInviteToForum() {
    return Discourse.User.currentProp('can_invite_to_forum');
  },

  toggleBookmark() {
    this.state.bookmarked = !this.state.bookmarked;
    const topicController = this.register.lookup('controller:topic');
    topicController.send('toggleBookmark');
  },

  sendShowLogin() {
    const appRoute = this.register.lookup('route:application');
    appRoute.send('showLogin');
  },

  sendShowCreateAccount() {
    const appRoute = this.register.lookup('route:application');
    appRoute.send('showCreateAccount');
  },

  showInvite() {
    const topicRoute = this.register.lookup('route:topic');
    topicRoute.send('showLogin');
  },

  html(attrs, state) {
    const { currentUser } = this;
    const topic = state.topic;
    let contents = [];

    if (currentUser) {
      const username = currentUser.get('username');
      const userPath = currentUser.get('path');

      contents.push(
        h('div.avatar', avatarImg('large', {
          template: currentUser.get('avatar_template'),
          username: username
        })),
        h('div.profile-top', this.attach('user-menu-links', { path: userPath }))
      );
    } else {
      contents.push(h('div.widget-title', I18n.t('profile_widget.guest')));

      if (!topic) {
        contents.push(this.attach('login-required'));
      }
    }

    let actions = [];

    if (topic) {
      if (currentUser && topic.details.can_invite_to) {
        actions.push(this.attach('button', {
          label: 'topic.invite_reply.title',
          icon: 'envelope-o',
          action: 'showInvite',
          className: 'btn-small'
        }));
      }

      actions.push(this.attach('button', {
        action: 'share',
        label: 'topic.share.title',
        className: 'btn-small share',
        icon: 'link',
        data: {
          'share-url': topic.get('shareUrl')
        }
      }));

      if (currentUser) {
        let tooltip = state.bookmarked ? 'bookmarks.created' : 'bookmarks.not_bookmarked';
        let label = state.bookmarked ? 'bookmarked.clear_bookmarks' : 'bookmarked.title';
        let buttonClass = 'btn btn-small bookmark';

        if (state.bookmarked) buttonClass += ' bookmarked';

        actions.push(
          this.attach('button', {
            action: 'toggleBookmark',
            title: tooltip,
            label: label,
            icon: 'bookmark',
            className: buttonClass
          }),
          new ComponentConnector(this,'topic-notifications-button', {
            topic,
            appendReason: false,
            showFullTitle: true,
            className: 'btn-small'
          })
        );
      } else {
        actions.push(this.attach('button', {
          label: 'topic.reply.title',
          icon: 'reply',
          action: 'sendShowLogin',
          className: 'btn-small'
        }));
      }
    } else {
      if (!this.site.mobileView && this.canInviteToForum()) {
        actions.push(this.attach('link', {
          route: 'userInvited',
          icon: 'user-plus',
          label: 'user.invited.title',
          model: currentUser,
          className: 'btn btn-small'
        }));
      }
    }

    contents.push(
      h('div.profile-actions', actions)
    );

    return h('div.widget-inner', contents);
  }

});
