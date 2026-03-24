create table if not exists public.page_views (
  path text primary key,
  views bigint not null default 0,
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.increment_page_views(page_path text)
returns void
language plpgsql
security definer
as $$
begin
  insert into public.page_views (path, views)
  values (page_path, 1)
  on conflict (path)
  do update set
    views = public.page_views.views + 1,
    updated_at = timezone('utc', now());
end;
$$;
