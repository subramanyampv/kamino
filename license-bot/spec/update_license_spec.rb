require "rspec"
require "update_license"

RSpec.describe "update_license" do
  it "does not update the license if the text does not start with Copyright (c)" do
    line = "opyright (c) 2017 Nikolaos Georgiou"
    result = update_license(line, "2018")
    expect(result).to eq("opyright (c) 2017 Nikolaos Georgiou")
  end

  it "does not update the license if the year is the same" do
    line = "Copyright (c) 2017 Nikolaos Georgiou"
    result = update_license(line, "2017")
    expect(result).to eq("Copyright (c) 2017 Nikolaos Georgiou")
  end

  it "updates the license if the year is different" do
    line = "Copyright (c) 2017 Nikolaos Georgiou"
    result = update_license(line, "2018")
    expect(result).to eq("Copyright (c) 2017-2018 Nikolaos Georgiou")
  end

  it "does not update the license if the end year is the same" do
    line = "Copyright (c) 2015-2017 Nikolaos Georgiou"
    result = update_license(line, "2017")
    expect(result).to eq("Copyright (c) 2015-2017 Nikolaos Georgiou")
  end

  it "updates the license if the end year is different" do
    line = "Copyright (c) 2015-2017 Nikolaos Georgiou"
    result = update_license(line, "2018")
    expect(result).to eq("Copyright (c) 2015-2018 Nikolaos Georgiou")
  end
end

RSpec.describe "update_license_lines" do
  it "returns false if no lines changed" do
    lines = [
      "Hello",
      "Copyright (c) 2015 Nikolaos Georgiou"
    ]
    new_lines, has_changes = update_license_lines(lines, "2015")
    expect(has_changes).to eq(false)
    expect(new_lines).to eq(lines)
  end

  it "returns true if lines changed" do
    lines = [
      "Hello",
      "Copyright (c) 2015 Nikolaos Georgiou"
    ]
    new_lines, has_changes = update_license_lines(lines, "2016")
    expect(has_changes).to eq(true)
    expect(new_lines).to eq([
                              "Hello",
                              "Copyright (c) 2015-2016 Nikolaos Georgiou"
                            ])
  end
end
