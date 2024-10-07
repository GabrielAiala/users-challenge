class User < ApplicationRecord
  has_many :addresses, dependent: :destroy 
  accepts_nested_attributes_for :addresses, allow_destroy: true

  validates_format_of :email, :with => /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i
end
