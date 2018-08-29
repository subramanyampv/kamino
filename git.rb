class Git
  def clone(clone_url, clone_dir_root)
    Kernel.system("git clone #{clone_url}", :chdir=>clone_dir_root)
  end
end
