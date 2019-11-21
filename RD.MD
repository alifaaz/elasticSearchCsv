### the app 


## ToDO list
[/] setting app the server and routes
[/] addCustemer 
[/] add csvCustomer 
    |_ [/] make it thread
    |_ [/] remove the header 
[/] plan for elastic query
    |_ [/]read books about it
    |_ [/]plan for single query to match exact and partial
    |_[/] plan for multiple query one come for match and the other for exact

[/] frontEnd
    |_ [/] customer form
    |_ [/] csv uploader
    |_ [/] modal
    |_ [/] http requests
        |_ [/] upload csv
        |_ [/] add customer
        |_ [/] add partialExact
        |_ [/] mainpulate ui
curl -XPOST "localhost:9200/customers/_mapping?pretty" -H 'Content-Type: application/json' -d"
{
  \"properties\": {
    \"name\": {
      \"type\": \"text\",
      \"fields\": {
        \"name.keyword\": {
          \"type\": \"keyword\"
        }
      }
    },
     \"email\": {
      \"type\": \"text\",
      \"fields\": {
        \"email.keyword\": {
          \"type\": \"keyword\"
        }
      }
    },
    \"phone1\": {
      \"type\": \"text\",
      \"fields\": {
        \"phone1.keyword\": {
          \"type\": \"keyword\"
        }
      }
    },
     \"phone2\": {
      \"type\": \"text\",
      \"fields\": {
        \"phone2.keyword\": {
          \"type\": \"keyword\"
        }
      }
    }
  }
}
"


# elastic query
 \"bool\": {
                \"should\": [
                    {
                        \"bool\": {
                            \"boost\": 10,
                            \"must\": [
                                {
                                    \"term\":{
                                        \"name.keyword\":thisData.name
                                    }
                                },
                                {
                                    \"term\": {
                                        \"email.keyword\": thisData.email
                                    }
                                },
                                {
                                    \"terms\": {
                                        \"phone1.keyword\": [thisData.phone1, thisData.phone2]
                                    }
                                },
                                {
                                    \"terms\": {
                                        \"phone2.keyword\": [thisData.phone1, thisData.phone2]
                                    }
                                }
                            ]
                        }
                    },
                    {
                        \"bool\": {
                            \"should\": [
                                {
                                    \"bool\": {
                                        \"must\": [
                                            {
                                                \"match\": {
                                                    \"name\": {
                                                        \"query\": thisData.name,
                                                        \"operator\": \"and\",
                                                        \"fuzziness\": 0,
                                                        \"fuzzy_transpositions\": \"false\",
                                                        \"auto_generate_synonyms_phrase_query\": \"false\"
                                                    }
                                                }
                                            },
                                            {
                                                \"term\": {
                                                    \"email.keyword\": thisData.email
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    \"bool\": {
                                        \"must\": [
                                            {
                                                \"term\": {
                                                    \"email.keyword\":thisData.email
                                                }
                                            },
                                            {
                                                \"bool\": {
                                                    \"should\": [
                                                        {
                                                            \"terms\": {
                                                                \"phone1\": [thisData.phone1, thisData.phone2]
                                                            }
                                                        },
                                                        {
                                                            \"terms\": {
                                                                \"phone2\": [thisData.phone1, thisData.phone2]
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]

                                    }
                                },
                                {
                                    \"bool\": {
                                        \"must\": [
                                            {
                                                \"match\": {
                                                    \"name\": {
                                                        \"query\": thisData.name,
                                                        \"operator\": \"and\",
                                                        \"fuzziness\": 1,
                                                        \"fuzzy_transpositions\": \"false\",
                                                        \"auto_generate_synonyms_phrase_query\": \"false\"
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                ],
                \"boost\": 0.10000
            }
        


