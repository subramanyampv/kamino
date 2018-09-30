# frozen_string_literal: true

# Mixin for repository.
module RepoMixin
  attr_accessor :name
  attr_accessor :owner

  def slug
    "#{owner}/#{name}"
  end

  def encoded_slug
    "#{owner}%2F#{name}"
  end
end
