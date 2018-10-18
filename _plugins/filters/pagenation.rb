module Filters
  module AssetFilter
    def asset_url(input)
      p context.registers.config
      # "http://www.example.com/#{input}?#{Time.now.to_i}"
    end
  end
end

Liquid::Template.register_filter(Jekyll::AssetFilter)
