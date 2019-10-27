# frozen_string_literal: true

require "delegate"

module RepoProviders
  # A decorator for a repo provider which does not execute actions
  # such as create or delete repository.
  class DryRunProviderDecorator < SimpleDelegator
    def create_repo(*)
      # '*' means we don't care about the arguments
      puts "Would have created repo"
    end

    def delete_repo
      puts "Would have deleted repo"
    end

    def activate_repo
      puts "Would have activated repo"
    end

    def deactivate_repo
      puts "Would have deactivated repo"
    end
  end
end
