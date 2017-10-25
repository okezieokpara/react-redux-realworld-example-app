import ListErrors from './ListErrors';
import React from 'react';
import agent from '../agent';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {
  ADD_TAG,
  EDITOR_PAGE_LOADED,
  REMOVE_TAG,
  ARTICLE_SUBMITTED,
  EDITOR_PAGE_UNLOADED,
  UPDATE_FIELD_EDITOR
} from '../constants/actionTypes';

const mapStateToProps = state => ({
  ...state.editor
});

const mapDispatchToProps = dispatch => ({
  onAddTag: () =>
    dispatch({type: ADD_TAG}),
  onLoad: payload =>
    dispatch({type: EDITOR_PAGE_LOADED, payload}),
  onRemoveTag: tag =>
    dispatch({type: REMOVE_TAG, tag}),
  onSubmit: payload =>
    dispatch({type: ARTICLE_SUBMITTED, payload}),
  onUnload: payload =>
    dispatch({type: EDITOR_PAGE_UNLOADED}),
  onUpdateField: (key, value) =>
    dispatch({type: UPDATE_FIELD_EDITOR, key, value})
});

class Editor extends React.Component {
  constructor() {
    super();

    const updateFieldEvent =
      key => ev => this.props.onUpdateField(key, ev.target.value);
    this.handleChangeTitle = updateFieldEvent('title');
    this.handleChangeDescription = updateFieldEvent('description');
    this.handleChangeBody = updateFieldEvent('body');
    this.handleChangeTagInput = updateFieldEvent('tagInput');

    this.handleWatchForEnter = ev => {
      if (ev.keyCode === 13) {
        ev.preventDefault();
        this.props.onAddTag();
      }
    };

    this.removeTagHandler = tag => () => {
      this.props.onRemoveTag(tag);
    };

    this.handleSubmitForm = ev => {
      ev.preventDefault();
      const article = {
        title: this.props.title,
        description: this.props.description,
        body: this.props.body,
        tagList: this.props.tagList
      };

      const slug = {slug: this.props.articleSlug};
      const promise = this.props.articleSlug ?
        agent.Articles.update(Object.assign(article, slug)) :
        agent.Articles.create(article);

      this.props.onSubmit(promise);
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.slug !== nextProps.match.params.slug) {
      if (nextProps.match.params.slug) {
        this.props.onUnload();
        return this.props.onLoad(agent.Articles.get(this.props.match.params.slug));
      }
      this.props.onLoad(null);
    }
  }

  componentWillMount() {
    if (this.props.match.params.slug) {
      return this.props.onLoad(agent.Articles.get(this.props.match.params.slug));
    }
    this.props.onLoad(null);
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    return (
      <div className="editor-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-10 offset-md-1 col-xs-12">

              <ListErrors errors={this.props.errors}/>

              <form>
                <fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="text"
                      placeholder="Article Title"
                      value={this.props.title}
                      onChange={this.handleChangeTitle}
                    />
                  </fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="What's this article about?"
                      value={this.props.description}
                      onChange={this.handleChangeDescription}
                    />
                  </fieldset>

                  <fieldset className="form-group">
                    <textarea
                      className="form-control"
                      rows="8"
                      placeholder="Write your article (in markdown)"
                      value={this.props.body}
                      onChange={this.handleChangeBody}
                      />
                  </fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Enter tags"
                      value={this.props.tagInput}
                      onChange={this.handleChangeTagInput}
                      onKeyUp={this.handleWatchForEnter}
                    />

                    <div className="tag-list">
                      {
                        (this.props.tagList || []).map(tag => {
                          return (
                            <span className="tag-default tag-pill" key={tag}>
                              <i
                                className="ion-close-round"
                                onClick={this.removeTagHandler(tag)}
                              />
                              {tag}
                            </span>
                          );
                        })
                      }
                    </div>
                  </fieldset>

                  <button
                    className="btn btn-lg pull-xs-right btn-primary"
                    type="button"
                    disabled={this.props.inProgress}
                    onClick={this.handleSubmitForm}
                  >
                    Publish Article
                  </button>

                </fieldset>
              </form>

            </div>
          </div>
        </div>
      </div>
    );
  }
}
Editor.propTypes = {
  onUpdateField: PropTypes.func,
  onAddTag: PropTypes.func,
  onSubmit: PropTypes.func,
  onRemoveTag: PropTypes.func,
  title: PropTypes.string,
  description: PropTypes.string,
  body: PropTypes.string,
  tagList: PropTypes.string,
  articleSlug: PropTypes.string,
  slug: PropTypes.string,
  match: PropTypes.any,
  inProgress: PropTypes.bool,
  tagInput: PropTypes.string,
  errors: PropTypes.any,
  onUnload: PropTypes.func,
  onLoad: PropTypes.func

};
export default connect(mapStateToProps, mapDispatchToProps)(Editor);
