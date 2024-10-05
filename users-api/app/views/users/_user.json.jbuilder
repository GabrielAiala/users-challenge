json.id user.id
json.name user.name
json.cpf user.cpf
json.email user.email
json.birth_date user.birth_date
json.created_at user.created_at
json.updated_at user.updated_at
if user.addresses.any?
  json.addresses do
    json.array! user.addresses, partial: 'addresses/address', as: :address
  end
end